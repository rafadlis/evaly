import Elysia, { t } from "elysia";
import { organizationMiddleware } from "../../middlewares/auth.middleware";
// import { openai } from "@ai-sdk/openai";
import { generateObject, generateText, streamObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { createQuestionTemplate } from "../../services/organization/question/create-question-template";
import { updateQuestionTemplate } from "../../services/organization/question/update-question-template";
import { InsertQuestion, UpdateQuestion } from "../../types/question";
import { nanoid } from "nanoid";
import db from "../../lib/db";
import { question } from "../../lib/db/schema";
import { buildConflictUpdateColumns } from "../../lib/build-conflict-update-columns";
import { QuestionGenerated } from "../../types/question.generated";

export const llmRouter = new Elysia().group("/llm", (app) => {
  return app
    .derive(organizationMiddleware)
    .post(
      "/validate",
      async ({ body, organizer }) => {
        const organizationId = organizer.organizationId;
        const organizerId = organizer.id;

        const prompt = body.prompt;

        const response = await generateObject({
          model: google("gemini-2.0-flash-001"),
          prompt: `You are an assistant designed to extract structured information from user prompts.
          
          Analyze the user's input carefully and extract the following key information:
          1. The educational topic they want to create questions about
          2. The appropriate education level for the material
          3. The number of questions they want to generate
          4. The question type they want to use (if specified)
          
          Be precise and consistent in your extraction. The topic you identify will be used directly in subsequent prompts to generate educational content, so ensure it accurately represents the user's intent.
          
          CRITICAL REQUIREMENTS:
          - For the topic field: If the user does not explicitly mention an educational topic, you MUST return "undefined" for the topic value. Do not make assumptions or infer a topic if it's not clearly stated.
          - For the grade/education level: If the user does not explicitly mention a grade level, you MUST return "undefined". Do not guess or infer a grade level if it's not clearly stated.
          - For the suggestion: If the user's input is missing information or could be improved, provide a helpful suggestion. This could be asking them to specify a topic, grade level, or to make their topic more specific. If the input is valid and complete, leave this field empty.
          - For the questionType: Detect if the user mentions a specific question type. Map their description to one of our supported types: "multiple-choice", "text-field", or "yes-or-no". Look for phrases like "multiple choice", "MCQ", "text answer", "short answer", "essay", "open-ended", "yes/no", "true/false", etc. If no type is mentioned, default to "multiple-choice".
          - For the generationPrompt: Create a comprehensive, detailed prompt that can be used for question generation if the topic and grade are valid. This prompt should include specific instructions about the topic, difficulty level, question format (using the detected question type), and educational objectives. If either topic is "undefined" or grade is "undefined", leave this field empty.
          
          Do not try to be helpful by guessing these values - accuracy is more important than completeness. If information is missing, use "undefined" for those fields.
          
          IMPORTANT: You MUST respond in the EXACT SAME LANGUAGE that the user used in their prompt. If they write in Indonesian, Japanese, German, or any other language, analyze their request and respond in that same language. This includes all fields in your response - topic, suggestion, title, tags, and generationPrompt must all be in the user's language.
          
          User prompt: ${prompt}`,
          schema: z.object({
            topic: z
              .string()
              .describe(
                "The specific educational topic to create questions about. MUST be 'undefined' if no topic is clearly specified"
              ),
            grade: z
              .enum([
                "Kindergarten",
                "1st Grade",
                "2nd Grade",
                "3rd Grade",
                "4th Grade",
                "5th Grade",
                "6th Grade",
                "7th Grade",
                "8th Grade",
                "9th Grade",
                "10th Grade",
                "11th Grade",
                "12th Grade",
                "College",
                "undefined",
              ])
              .describe(
                "The appropriate education level for the material. MUST be 'undefined' if no grade level is clearly specified"
              ),
            questionCount: z
              .number()
              .int()
              .min(1)
              .max(50)
              .default(5)
              .describe("Number of questions to generate, default is 5."),
            questionType: z
              .enum(["multiple-choice", "text-field", "yes-or-no"])
              .describe(
                "The type of questions to generate, based on user's description. Default to multiple-choice if not specified."
              ),
            isValid: z
              .boolean()
              .describe(
                "Whether the input contains all required information (topic and grade) to generate questions"
              ),
            suggestion: z
              .string()
              .describe(
                "A helpful message to show to the user about what information they should provide or how they could improve their prompt. Empty if the input is valid."
              ),
            title: z
              .string()
              .describe(
                "A concise, descriptive title for the question set based on the topic and grade level"
              ),
            tags: z
              .array(z.string())
              .describe(
                "1-3 relevant tags that categorize this question set (only if necessary)"
              ),
            generationPrompt: z
              .string()
              .describe(
                "A comprehensive, detailed prompt that can be used for question generation. This should include specific instructions about the topic, difficulty level appropriate for the grade, question format (using the detected question type), and educational objectives. Empty if either topic or grade is undefined."
              ),
          }),
        });

        if (!response.object.isValid) {
          return { object: response.object };
        }

        console.log(response.object);

        const templateCreated = await createQuestionTemplate(
          {
            organizationId,
            organizerId,
            isAiGenerated: true,
            title: response.object.title,
            tags: response.object.tags,
            aiContents: [
              {
                prompt: response.object.generationPrompt,
                context: body.context || "educational",
              },
            ],
          },
          false
        );

        return { object: response.object, templateCreated };
      },
      {
        body: t.Object({
          prompt: t.String(),
          context: t.Optional(
            t.Enum({ educational: "educational", hr: "hr", quiz: "quiz" })
          ),
        }),
      }
    )
    .post(
      "/completition",
      async function ({ organizer, body, request, set, error }) {
        const organizationId = organizer.organizationId;
        let prompt = body.prompt;
        let context = body.context || "educational"; // Default to educational if not specified
        const templateId = body.templateId;

        // Get Existing Data
        const template = await updateQuestionTemplate(
          templateId,
          organizationId,
          {
            isGenerating: true,
            isGeneratingExpiredAt: new Date(
              Date.now() + 5 * 60 * 1000
            ).toISOString(), // 5min
          }
        );

        if (!template) {
          return error("Not Found");
        }

        // Assign the last prompt and context if there is no input or if user didn't override it
        if (
          template.aiContents &&
          template.aiContents[template.aiContents?.length - 1]
        ) {
          const lastAiContents =
            template.aiContents[template.aiContents?.length - 1];

          if (!prompt) {
            prompt = lastAiContents.prompt;
            context = lastAiContents.context;
          }
        }

        const message = await streamObject({
          model: google("gemini-2.0-flash-001"),
          prompt: `You are an expert question generator. Based on the following topic, context, and instructions, generate well-crafted questions.

Topic: ${prompt}
Template ID: ${templateId}
Context: ${context}

Instructions:
1. Create questions that are clear, well-formatted, and appropriate for the specified context and topic
2. For "educational" context: Focus on testing knowledge, understanding, and application of concepts in academic settings
3. For "hr" context: Focus on evaluating skills, experience, problem-solving abilities, and cultural fit for job candidates
4. For "quiz" context: Create engaging, fun questions suitable for trivia or general knowledge quizzes
5. Each question should be properly formatted with correct grammar and punctuation
6. For multiple-choice questions, ensure there is exactly one correct answer and provide plausible distractors
7. Questions can include Markdown formatting for better readability (bold, italics, lists, etc.)
8. For "multiple-choice" type questions, always provide exactly 4 options
9. For "yes-or-no" type questions, always provide exactly 2 options (Yes and No)
10. For "text-field" type questions, do not provide any options
11. Output language should match the language used in the input prompt
12. IMPORTANT: For multiple-choice questions, randomize the position of the correct answer. Do not always put the correct answer in the same position (e.g., not always as the first option or last option)

Please generate questions according to the specified schema structure.`,
          schema: QuestionGenerated,
          maxRetries: 3,
          onFinish: async ({ usage, object }) => {
            if (!object?.questions || !object?.questions.length || !prompt) {
              return;
            }

            const currentAiContents = template.aiContents || [];
            const aiContentVersions = [
              ...currentAiContents,
              { context, prompt, questions: object?.questions, usage },
            ];

            const insertedQuestions: InsertQuestion[] = object?.questions.map(
              (e) => ({
                id: e.id.length > 0 ? e.id : "qst-" + Bun.randomUUIDv7(),
                referenceId: templateId,
                question: e.question,
                order: e.order,
                referenceType: "template",
                type: e.type as UpdateQuestion["type"],
                options: e.options.map((e) => ({
                  id: e.id.length > 0 ? e.id : nanoid(5),
                  text: e.text,
                  isCorrect: e.isCorrect,
                })),
              })
            );

            await db
              .insert(question)
              .values(insertedQuestions)
              .onConflictDoUpdate({
                target: [question.id],
                set: buildConflictUpdateColumns(question, [
                  "question",
                  "type",
                  "options",
                ]),
              });

            const updatedQuestionTemplate = await updateQuestionTemplate(
              templateId,
              organizationId,
              {
                aiContents: aiContentVersions,
                updatedAt: new Date().toISOString(),
                isAiGenerated: true,
                isGenerating: false,
                isGeneratingExpiredAt: null,
              }
            );
          },
          onError(event) {
            console.log(event.error);
          },
        });

        return message.toTextStreamResponse();
      },
      {
        body: t.Object({
          prompt: t.Optional(t.String()),
          templateId: t.String(),
          context: t.Optional(
            t.Enum({ educational: "educational", hr: "hr", quiz: "quiz" })
          ),
        }),
      }
    )
    .post(
      "/improve-prompt",
      async ({ body }) => {
        const { prompt } = body;
        
        const response = await generateText({
          model: google("gemini-2.0-flash-001"),
          prompt: `
            You are an expert at writing clear, effective prompts for question generation.
            
            I'll provide you with a user's prompt that they want to use to generate questions.
            Your task is to improve this prompt to make it clearer, more specific, and more likely to generate high-quality questions.
            
            Focus on:
            - Clarifying ambiguous language
            - Adding structure if needed
            - Ensuring the prompt specifies the desired question types, difficulty levels, and topics clearly
            - Maintaining the original intent of the prompt
            
            Original prompt: "${prompt}"
            
            Respond with ONLY the improved prompt text, with no explanations, examples, or additional commentary.
            If the prompt is already clear and effective, or you cannot meaningfully improve it, respond with an empty string.
            Do NOT include placeholder text like "[insert specific topic here]" or "[insert number]" in your response.
            
            IMPORTANT: Respond in the same language as the original prompt. If the original prompt is in English, respond in English. If it's in Spanish, respond in Spanish, etc.
          `,
        });
        
        return response.text
      },
      {
        body: t.Object({
          prompt: t.String(),
        }),
      }
    );
});
