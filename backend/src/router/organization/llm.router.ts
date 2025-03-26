import Elysia, { t } from "elysia";
import { organizationMiddleware } from "../../middlewares/auth.middleware";
import { appendResponseMessages, streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import db from "../../lib/db";
import { llmMessage } from "../../lib/db/schema";
import { and, eq, sql } from "drizzle-orm";

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
   - ONLY mention the 50-question limit when users request more than 50 questions
5. Ensure all question IDs are unique strings (e.g., "q1", "q2", etc.) and option IDs follow pattern (e.g., "q1_opt1", "q1_opt2")
6. Be conversational and natural in your responses, tailoring to the ${userPersona} role
7. When user asks to edit or modify specific questions:
   - ALWAYS regenerate the ENTIRE set of questions, not just the modified ones
   - Maintain the same total number of questions as before
   - Apply the requested changes to the specified question(s)
   - Make sure the edited questions fit cohesively with the rest
8. ALWAYS ask for these critical details if not provided:
   - The TOPIC of the questions (subject matter, concept, skill being tested)
   - The TARGET AUDIENCE (grade level, student age, candidates for interview, etc.)
   - The NUMBER of questions
9. ONLY USE THE TOOL to generate questions - DO NOT include the questions in your text response
10. Your response should ONLY contain a brief greeting and closing message - the actual questions will be handled by the tool
11. DO NOT repeat or summarize the questions after using the tool - this creates duplicate content
12. Respond as if in a direct conversation while strictly following these requirements
13. IMPORTANT: You must handle tool calls one at a time. While you can make multiple tool calls in a conversation, you must wait for each tool call to complete before making another one. Do not attempt to make multiple simultaneous tool calls.`;

        const result = streamText({
          model: openai("gpt-4o-mini"),
          toolCallStreaming: true,
          messages: body.messages,
          maxSteps: 5,
          system: systemMessage,
          tools: {
            generateQuestion: tool({
              description:
                "Generate high-quality, engaging questions based on the user's input and persona",
              parameters: z.object({
                preMessage: z
                  .string()
                  .describe(
                    "A brief pre-message to the user, you can summarize the questions generated and the user's input"
                  ),
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
                    "An array of questions. The number of questions MUST match exactly what the user requested. If the user didn't specify a count, generate EXACTLY 5 questions. DEFAULT to multiple-choice type unless explicitly requested otherwise."
                  ),
                summary: z
                  .string()
                  .describe(
                    "Create a concise, descriptive summary that accurately reflects the topic of the generated questions. The summary should be brief (5-10 words), specific to the subject matter, and professional in tone. Base it on both the user's request and the content of the questions you've generated."
                  ),
              }),
              execute: async function ({ questions }) {
                return {
                  questions,
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
