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
      async function* ({ organizer, body, request }) {
        const organizationId = organizer.organizationId;
        const templateId = body.id; // or chatId

        const userPersona = body.userPersona;

        // const message: Message = {
        //   id: `llm_${ulid()}`,
        //   role: "user",
        //   content: body.message,
        // };

        const result = streamText({
          model: openai("o3-mini-2025-01-31"),
          toolCallStreaming: true,
          prompt: body.message,
          tools: {
            generateQuestion: tool({
              description:
                "Generate high-quality, engaging multiple-choice questions based on the user's input",
              parameters: z.object({
                preMessage: z
                  .string()
                  .describe(
                    "A warm, personalized introduction that acknowledges the user's request and sets the context for the questions that follow. Should be friendly, professional, and build anticipation for the learning experience."
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
                  .describe(
                    "A concluding message that wraps up the question generation process, encourages the user to engage with the questions, and offers any additional guidance or next steps"
                  ),
              }),
            }),
          },
          onFinish: (result) => {
            console.log(result);
          },
          onError: (error) => {
            console.log(error);
          },
        });

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
