import Elysia, { t } from "elysia";
import { organizationMiddleware } from "../../middlewares/auth.middleware";
import { createQuestionTemplate } from "../../services/organization/question/create-question-template";
import { CoreMessage, streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import db from "../../lib/db";
import { llmMessage } from "../../lib/db/schema";

export const llmRouter = new Elysia().group("/llm", (app) => {
  return app
    .derive(organizationMiddleware)
    .post(
      "/create",
      async ({ organizer, body }) => {
        const createdTemplate = await createQuestionTemplate(
          {
            organizationId: organizer.organizationId,
            organizerId: organizer.id,
            isAiGenerated: true,
          },
          false
        );

        // upload the files to the database

        return {
          templateId: createdTemplate.id,
          message: body.message,
          // attachments: body.files,
        };
      },
      {
        body: t.Object({
          files: t.Optional(t.Array(t.File())),
          message: t.String(),
        }),
      }
    )
    .post(
      "/chat",
      async function* ({ organizer, body, request, set }) {
        const organizationId = organizer.organizationId;
        const templateId = body.id; // or chatId

        const userPersona = body.userPersona;

        // Get existing messages from the database
        const existingMessagesRes = await db.query.llmMessage.findMany({
          where(fields, { eq }) {
            return eq(fields.referenceId, templateId);
          },
          orderBy(fields, { asc }) {
            return asc(fields.createdAt);
          },
        });

        // Convert database messages to Message format
        const existingMessages: CoreMessage[] = existingMessagesRes
          .filter((msg) => msg.message !== null)
          .map((msg) => msg.message as CoreMessage);

        const message: CoreMessage = {
          role: "user",
          content: body.message,
        };

        await db.insert(llmMessage).values({
          referenceId: templateId,
          message: message,
          organizationId,
        });

        const systemMessage: CoreMessage = {
          role: "system",
          content: `You are Evaly, an educational AI assistant that generates questions based on user requests. The current user's role is: ${userPersona}.

IMPORTANT INSTRUCTIONS FOR QUESTION GENERATION:
1. ALWAYS generate multiple-choice questions by default unless the user EXPLICITLY requests text-field questions
2. If the user requests a mix of question types or specifies types for specific questions, follow those instructions precisely
3. For multiple-choice questions, always include 4 options with exactly one correct option marked as isCorrect=true
4. ALWAYS generate EXACTLY the number of questions that the user requests:
   - If user specifically requests "X questions" or "X MCQs" etc., generate EXACTLY X questions
   - If user doesn't specify a number, generate EXACTLY 5 questions
5. Ensure all question IDs are unique strings (e.g., "q1", "q2", etc.) and option IDs follow pattern (e.g., "q1_opt1", "q1_opt2")
6. Be conversational and natural in your responses, tailoring to the ${userPersona} role
7. Respond as if in a direct conversation while strictly following the question format and count requirements.`,
        };

        // Combine existing messages with new message
        const messages: CoreMessage[] = [
          systemMessage,
          ...existingMessages,
          message,
        ];

        console.log(JSON.stringify(messages, null, 2));

        const result = streamText({
          model: openai("o3-mini"),
          toolCallStreaming: true,
          messages,
          tools: {
            generateQuestion: tool({
              description:
                "Generate high-quality, engaging questions based on the user's input and persona",
              parameters: z.object({
                preMessage: z
                  .string()
                  .describe(
                    "A brief, natural greeting that acknowledges the user's specific request. Keep it conversational but concise."
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
                      answer: z
                        .string()
                        .describe(
                          "The correct answer to the question. For multiple-choice, this should match the text of the correct option."
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
                postMessage: z
                  .string()
                  .describe(
                    "A brief, natural closing that relates to the questions provided. Keep it conversational but concise."
                  ),
              }),
            }),
          },
          onFinish: async ({ response }) => {
            if (response.messages.length > 0) {
              const message = response.messages[0];
              await db.insert(llmMessage).values({
                referenceId: templateId,
                message: message,
                organizationId,
              });
            }
          },
          onError: (error) => {
            console.error(error);
          },
        });

        result.consumeStream();

        for await (const chunk of result.fullStream) {
          if (chunk.type === "tool-call-delta") {
            yield chunk.argsTextDelta;
          }
        }
      },
      {
        body: t.Object({
          message: t.String(),
          id: t.String(),
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
    );
});
