import Elysia, { t } from "elysia";
import { organizationMiddleware } from "../../middlewares/auth.middleware";
import { appendResponseMessages, streamText, tool } from "ai";
// import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import db from "../../lib/db";
import { llmMessage } from "../../lib/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { google } from "@ai-sdk/google";

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
      "/chat",
      async function ({ organizer, body, request, set }) {
        const organizationId = organizer.organizationId;
        const templateId = body.templateId; // or chatId
        const userPersona = body.userPersona;

        // Save the messages to the database
        await db
          .insert(llmMessage)
          .values({
            messages: body.messages,
            organizationId,
            id: templateId,
          })
          .onConflictDoUpdate({
            target: llmMessage.id,
            set: {
              messages: body.messages,
            },
          });

        const systemMessage = `You are Evaly, an educational AI assistant that generates questions based on user requests. The current user's role is: ${userPersona}.

IMPORTANT INSTRUCTIONS FOR QUESTION GENERATION:
1. ALWAYS generate multiple-choice questions by default unless the user EXPLICITLY requests text-field questions
2. If the user requests a mix of question types or specifies types for specific questions, follow those instructions precisely
3. For multiple-choice questions, always include 4 options with exactly one correct option marked as isCorrect=true
4. ALWAYS generate EXACTLY the number of questions that the user requests:
   - If user specifically requests "X questions" or "X MCQs" etc., generate EXACTLY X questions
   - If user doesn't specify a number, generate EXACTLY 5 questions
   - If user requests more than 50 questions, REJECT the request immediately and explain the 50-question limit
   - ONLY mention the 50-question limit when users request more than 50 questions, please don't mention it in other cases, it will break the conversation and the user will be angry
5. Ensure all question IDs are unique strings (e.g., "q1", "q2", etc.) and option IDs follow pattern (e.g., "q1_opt1", "q1_opt2")
6. Be conversational and natural in your responses, tailoring to the ${userPersona} role
7. When user asks to edit or modify specific questions:
   - ALWAYS regenerate the ENTIRE set of questions, not just the modified ones
   - Maintain the same total number of questions as before
   - If the user asks to edit or modify specific questions, you must regenerate the ENTIRE set of questions, not just the modified ones
   - If the user asks to add more questions, you must regenerate the ENTIRE set of questions, and add the new questions to the end of the set
   - Apply the requested changes to the specified question(s)
   - Make sure the edited questions fit cohesively with the rest
8. IMPORTANT: If the user asks to elaborate on already generated questions WITHOUT specifying a new topic, audience, or question count:
   - Use the SAME topic, audience, and number of questions from the previous generation
   - DO NOT ask for these details again
   - Just proceed with generating improved/elaborated questions based on the previous context.
9. User might ask to generate another topics variants, you need to remember the previous topics and generate the questions for the new topic.
10. Only ask for these critical details if not provided AND there are no previous questions generated:
   - The TOPIC of the questions (subject matter, concept, skill being tested)
   - The TARGET AUDIENCE (grade level, student age, candidates for interview, etc.)
   - The NUMBER of questions
11. ONLY USE TOOLS for generating content - NEVER include questions or topic recommendations in your text response
12. CRITICAL: NEVER DUPLICATE ANY CONTENT from the tools in your text response - this creates confusion
13. Respond as if in a direct conversation while strictly following these requirements
14. IMPORTANT: You must handle tool calls one at a time. While you can make multiple tool calls in a conversation, you must wait for each tool call to complete before making another one. Do not attempt to make multiple simultaneous tool calls.
15. CRITICAL: When using the generateQuestion tool, you MUST always include all three required fields:
   - 'questions': The array of question objects with their details
   - 'preMessage': A brief message to the user (keep it under 150 characters)
   - 'templateTitle': A concise title for the question set (keep it under 60 characters)
   If any of these fields are missing, the tool will fail and the questions won't be delivered to the user.
16. TOPIC SPECIFICITY REQUIREMENT:
   - If the user provides ONLY a broad subject area (e.g., "Math", "Science", "Chemistry", "History") WITHOUT specific topics
   - OR if the topic is too vague or general
   - THEN use the topicRecommendations tool FIRST to suggest specific topics before generating questions
   - After topic recommendations appear through the tool, simply ask the user to select a topic (don't repeat the topics)
   - ONLY proceed with question generation after you have a sufficiently specific topic
17. NO LISTS IN TEXT RESPONSES: Never include numbered lists, bullet points, or any structured data in your text responses - all structured data must come from tool calls
18. EXTREME BREVITY: Keep your text responses extremely brief - no longer than 1-2 short sentences
19. ZERO DUPLICATION: If you use the topicRecommendations tool, your text response should NEVER mention any of the specific topics - they are already displayed through the tool`



        const result = streamText({
          model: google("gemini-2.0-flash-001"),
          toolCallStreaming: true,
          messages: body.messages,
          system: systemMessage,
          maxSteps: 5,
          tools: {
            topicRecommendations: tool({
              description:
                "Generates specific topic recommendations when the user provides only a broad subject area or vague topic. Use this tool before generating questions when more specificity is needed.",
              parameters: z.object({
                subject: z
                  .string()
                  .describe(
                    "The broad subject area provided by the user (e.g., Math, Science, Chemistry)"
                  ),
                gradeLevel: z
                  .string()
                  .describe(
                    "The grade level or target audience if specified by the user"
                  ),
                recommendations: z
                  .array(
                    z.object({
                      topic: z
                        .string()
                        .describe(
                          "A specific topic or concept within the subject area"
                        ),
                      description: z
                        .string()
                        .describe(
                          "Brief description of what this topic covers"
                        ),
                    })
                  )
                  .describe(
                    "3-5 specific topic recommendations within the broad subject area"
                  ),
                explanationMessage: z
                  .string()
                  .describe(
                    "A brief message explaining why more specificity is needed and asking the user to select a topic"
                  ),
              }),
              execute: async function ({
                subject,
                gradeLevel,
                recommendations,
                explanationMessage,
              }) {
                return {
                  subject,
                  gradeLevel,
                  recommendations,
                  explanationMessage,
                };
              },
            }),
            generateQuestion: tool({
              description:
                "Generate complete question sets including questions, and a template title based on the user's input and persona. The tool handles the generation and formatting of the entire question package.",
              parameters: z.object({
                questions: z
                  .array(
                    z.object({
                      id: z
                        .string()
                        .describe(
                          "The unique identifier for this question, e.g. 'q1', 'q2', etc."
                        ),
                      question: z
                        .string()
                        .describe(
                          "The text of the question that tests knowledge or understanding"
                        ),
                      type: z
                        .enum(["multiple-choice", "text-field"])
                        .describe(
                          "The type of question. IMPORTANT: Use 'multiple-choice' as the default type unless explicitly requested otherwise by the user. If user mentions specific types for specific questions, follow those instructions exactly."
                        ),
                      options: z
                        .array(
                          z.object({
                            id: z
                              .string()
                              .describe(
                                "Unique identifier for this option (e.g., 'q1_opt1', 'q1_opt2')"
                              ),
                            text: z
                              .string()
                              .describe("The text content of this option"),
                            isCorrect: z
                              .boolean()
                              .describe(
                                "Whether this option is correct (exactly ONE option should be true for multiple-choice)"
                              ),
                          })
                        )
                        .describe(
                          "REQUIRED for multiple-choice questions: array of 4 options with exactly one marked as correct. MUST be omitted for text-field questions."
                        ),
                    })
                  )
                  .describe(
                    "An array of questions. The number of questions MUST match exactly what the user requested. Each question should be thoughtfully crafted to test understanding rather than just recall. Ensure questions are clear, unambiguous, and appropriate for the specified subject area. DEFAULT to multiple-choice type with 4 options (one correct) unless explicitly requested otherwise by the user."
                  ),
                title: z
                  .string()
                  .describe(
                    "A descriptive title for this group of questions that clearly identifies its subject matter and purpose. Keep it concise (under 60 characters) but specific. This will be displayed as the chat title and used for navigation."
                  ),
              }),
              execute: async function ({ questions, title }) {
                // Provide default title if not provided
                const defaultTitle = "Generated Question Set";

                return {
                  questions,
                  title: title || defaultTitle,
                };
              },
            }),
          },
          onFinish: async ({
            response,
            usage: { completionTokens, promptTokens, totalTokens },
          }) => {
            const messages = appendResponseMessages({
              messages: body.messages,
              responseMessages: response.messages,
            });

            await db
              .insert(llmMessage)
              .values({
                messages,
                organizationId,
                id: templateId,
                completitionTokens: completionTokens,
                promptTokens: promptTokens,
                totalTokens: totalTokens,
              })
              .onConflictDoUpdate({
                target: llmMessage.id,
                set: {
                  messages,
                  completitionTokens: sql`${llmMessage.completitionTokens} + ${completionTokens}`,
                  promptTokens: sql`${llmMessage.promptTokens} + ${promptTokens}`,
                  totalTokens: sql`${llmMessage.totalTokens} + ${totalTokens}`,
                },
              });
          },
          onError: (error) => {
            console.error(error);
          },
        });

        result.consumeStream();

        return result.toDataStreamResponse();
      },
      {
        body: t.Object({
          messages: t.Any(),
          templateId: t.String(),
          userPersona: t.Enum(
            {
              student: "student",
              teacher: "teacher",
              hr: "hr",
              parent: "parent",
              other: "other",
            },
            { default: "teacher" }
          ),
        }),
      }
    )
    .get("/chat/:id", async ({ organizer, params }) => {
      const messages = await db.query.llmMessage.findFirst({
        where: and(
          eq(llmMessage.id, params.id),
          eq(llmMessage.organizationId, organizer.organizationId)
        ),
      });

      return messages;
    });
});
