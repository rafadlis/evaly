import Elysia, { t } from "elysia";
import { organizationMiddleware } from "../../middlewares/auth.middleware";
import db from "../../lib/db";
import { llmMessage } from "../../lib/db/schema";
// import { openai } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateObject, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const openRouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const llmRouter = new Elysia().group("/llm", (app) => {
  return app
    .derive(organizationMiddleware)
    .post(
      "/create",
      async ({ organizer, error }) => {
        const createdMessage = await db
          .insert(llmMessage)
          .values({
            organizationId: organizer.organizationId,
          })
          .returning();

        if (!createdMessage || createdMessage.length === 0) {
          return error("Bad Request", "Failed to create chat");
        }

        return {
          id: createdMessage[0].id,
          // attachments: body.files,
        };
      },
      {
        body: t.Object({
          files: t.Optional(t.Array(t.File())),
        }),
      }
    )
    .post(
      "/validate",
      async ({body}) => {
        const prompt = body.prompt
        const response = await generateObject({
          model: google("gemini-2.0-flash-001"),
          prompt: `You are an assistant designed to extract structured information from user prompts.
          
          Analyze the user's input carefully and extract the following key information:
          1. The educational topic they want to create questions about
          2. The appropriate education level for the material
          3. The number of questions they want to generate
          4. The type of questions they prefer (multiple-choice, text-field, etc.)
          
          Be precise and consistent in your extraction. The topic you identify will be used directly in subsequent prompts to generate educational content, so ensure it accurately represents the user's intent.
          
          CRITICAL REQUIREMENTS:
          - For the topic field: If the user does not explicitly mention an educational topic, you MUST return "undefined" for the topic value. Do not make assumptions or infer a topic if it's not clearly stated.
          - For the grade/education level: If the user does not explicitly mention a grade level, you MUST return "undefined". Do not guess or infer a grade level if it's not clearly stated.
          - For the topic suggestion: If the user's topic is too general (like just "math" or "science"), provide a helpful suggestion to be more specific. If the topic is already specific enough, leave the suggestion empty.
          - For the generationPrompt: Create a comprehensive, detailed prompt that can be used for question generation if the topic and grade are valid. This prompt should include specific instructions about the topic, difficulty level, question format, and educational objectives. If either topic is "undefined" or grade is "undefined", leave this field empty.
          
          Do not try to be helpful by guessing these values - accuracy is more important than completeness. If information is missing, use "undefined" for those fields.
          
          IMPORTANT: Respond in the same language that the user used in their prompt. If they write in Indonesian, Japanese, German, or any other language, analyze their request and respond in that same language.
          
          User prompt: ${prompt}`,
          schema: z.object({
            topic: z.object({
              topic: z.string().describe("The specific educational topic to create questions about. MUST be 'undefined' if no topic is clearly specified"),
              suggestion: z.string().describe("Suggestion for the user if the topic is too general or vague. Leave empty if the topic is already specific enough.")
            }).describe("The educational topic with optional suggestion for improvement"),
            grade: z.enum([
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
              "undefined"
            ]).describe("The appropriate education level for the material. MUST be 'undefined' if no grade level is clearly specified"),
            questionCount: z.number().int().min(1).max(50).default(5).describe("Number of questions to generate, default is 5."),
            questionType: z.enum([
              "multiple-choice", 
              "text-field", 
              "true-false", 
              "mixed"
            ]).default("multiple-choice").describe("Preferred question format"),
            generationPrompt: z.string().describe("A comprehensive, detailed prompt that can be used for question generation. This should include specific instructions about the topic, difficulty level appropriate for the grade, question format, and educational objectives. Empty if either topic or grade is undefined.")
          }),
        });

        return response.object
      },
      {
        body: t.Object({
          prompt: t.String(),
        }),
      }
    )
    .post(
      "/completition",
      async function ({ organizer, body, request, set }) {
        const organizationId = organizer.organizationId;
        const prompt = body.prompt;
        const templateId = body.templateId;

        const message = await streamText({
          model: google("gemini-2.0-flash-001"),
          prompt: `You are a helpful assistant that can generate questions for given topic and audience.
        the topic is: ${prompt}
        the type of question is: multiple-choice
        generate the questions with the following format:

        q: question
        type: type of question (multiple-choice, text-field)
        a: option 1
        b: option 2
        c: option 3
        d: option 4
        correctOption: correct option (a, b, c, d)
        ===
        q: question
        type: type of question
        a: option 1
        b: option 2
        c: option 3
        d: option 4
        correctOption: correct option (a, b, c, d)
        ===

        IMPORTANT:
        - Use the following format for the questions
        - Do not include any other text in your response except the questions and options
        - if the type of question is text-field, do not include options
        - if the type of question is text-field, fill the correctOption with the suggested answer
        - if the type of question is multiple-choice, include 4 options
        - Generate total based on the requested number of questions
      `,
          maxRetries: 3,
          onFinish: async ({ response, usage }) => {
            console.log(JSON.stringify(response));
            console.log(usage);
          },
        });

        return message.toDataStreamResponse();
      },
      {
        body: t.Object({
          prompt: t.String(),
          templateId: t.String(),
        }),
      }
    );
  // .get("/chat/:id", async ({ organizer, params }) => {
  //   const messages = await db.query.llmMessage.findFirst({
  //     where: and(
  //       eq(llmMessage.id, params.id),
  //       eq(llmMessage.organizationId, organizer.organizationId)
  //     ),
  //   });

  //   return messages;
  // })
  // .get("/chat", async ({ organizer }) => {
  //   const messages = await db.query.llmMessage.findMany({
  //     where: eq(llmMessage.organizationId, organizer.organizationId),
  //     orderBy: desc(llmMessage.updatedAt),
  //   });

  //   return messages;
  // })
  // .get("/chat/2/:topic", async function* ({ organizer, params }) {

  //   for await (const chunk of message.textStream) {
  //     yield chunk;
  //   }
  // });
});
