import Elysia, { t } from "elysia";
import { organizationMiddleware } from "../../middlewares/auth.middleware";
import { createQuestionTemplate } from "../../services/organization/question/create-question-template";
import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

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

        // const message: Message = {
        //   id: `llm_${ulid()}`,
        //   role: "user",
        //   content: body.message,
        // };

        const result = streamText({
          model: openai("gpt-4o-mini"),
          toolCallStreaming: true,
          prompt: `${body.message}\n\nUser role: ${userPersona}. You are an educational AI chatbot assistant named Evaly. Respond professionally but conversationally as if in a natural chat. Vary your greetings and closings to sound human-like and less predictable. Adapt your tone to match the specific context and user's query rather than using generic templates.`,
          tools: {
            generateQuestion: tool({
              description:
                "Generate high-quality, engaging multiple-choice questions based on the user's input and persona",
              parameters: z.object({
                preMessage: z
                  .string()
                  .max(150)
                  .describe(
                    "A natural, varied greeting (max 20 words) that sounds like a real conversation. Avoid always introducing yourself the same way. Instead, respond contextually to the user's specific request in a way that feels spontaneous and personalized."
                  ),
                questions: z
                  .array(
                    z.object({
                      question: z
                        .string()
                        .describe(
                          "A clear, concise, and well-formulated question that tests knowledge or understanding"
                        ),
                      answer: z
                        .string()
                        .describe(
                          "The correct answer to the question, with enough detail to be educational but still concise"
                        ),
                      options: z
                        .array(z.string())
                        .describe(
                          "A list of plausible, distinct answer choices including the correct answer. Should be challenging yet fair."
                        ),
                    })
                  )
                  .describe(
                    "An array of thoughtfully crafted multiple-choice questions with corresponding answers and options"
                  ),
                postMessage: z
                  .string()
                  .max(150)
                  .describe(
                    "A natural, conversational closing (max 20 words) that varies based on the context of the interaction. Should feel like a real person wrapping up a conversation rather than a template. Occasionally ask questions or personalize the closing to the specific task completed."
                  ),
              }),
            }),
          },
          onFinish: ({ response }) => {
            console.log(response.messages);
          },
          onError: (error) => {},
        });

        result.consumeStream();

        for await (const chunk of result.fullStream) {
          if (chunk.type === "tool-call-delta") {
            yield chunk.argsTextDelta
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
