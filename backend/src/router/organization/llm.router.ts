import Elysia, { t } from "elysia";
import { organizationMiddleware } from "../../middlewares/auth.middleware";
import { createQuestionTemplate } from "../../services/organization/question/create-question-template";
import { Message } from "ai";
import { runs, tasks } from "@trigger.dev/sdk/v3";
import { llmGenerateQuestions } from "../../trigger/llm.generate-questions";
import { ulid } from "ulidx";
import db from "../../lib/db";
import { createInsertSchema } from "drizzle-typebox";
import { llmMessage } from "../../lib/db/schema";

export const llmRouter = new Elysia().group("/llm", (app) => {
  return app
    .derive(organizationMiddleware)
    .post(
      "/create",
      async ({ organizer, body, request }) => {
        const createdTemplate = await createQuestionTemplate(
          {
            organizationId: organizer.organizationId,
            organizerId: organizer.id,
            isAiGenerated: true,
          },
          false
        );

        return {
          templateId: createdTemplate.id,
        };
      },
      {
        body: t.Object({
          files: t.Optional(t.Array(t.File())),
          message: t.String(),
        }),
      }
    )
    .get(
      "/chat",
      async function* ({ organizer, body, request }) {
        const organizationId = organizer.organizationId;
        const templateId = "body.templateId";

        const message: Message = {
          id: `llm_${ulid()}`,
          role: "user",
          content: "Give me 5 questions",
        };

        const handle = await tasks.trigger<typeof llmGenerateQuestions>(
          "llm-generate-questions",
          {
            message,
            templateId,
            cookie: request.headers.get("cookie") ?? "",
          }
        );

        // await updateQuestionTemplate(templateId, organizationId, {
        //   latestRunId: handle.id,
        // });

        for await (const run of runs.subscribeToRun(handle.id)) {
          console.log("run", run);
          yield run;
        }
      },
      {
        // body: t.Object({
        //   message: t.String(),
        //   templateId: t.String(),
        // }),
      }
    )
    .get("/messages/:templateId", async ({ params, organizer }) => {
      const currentMessages = await db.query.llmMessage.findMany({
        where(fields, { eq, and }) {
          return and(
            eq(fields.referenceId, params.templateId),
            eq(fields.organizationId, organizer.organizationId)
          );
        },
        orderBy(fields, { asc }) {
          return asc(fields.createdAt);
        },
      });

      return currentMessages;
    })
    .post(
      "/messages/:templateId",
      async ({ params, organizer, body }) => {
        await db.insert(llmMessage).values(body.messages);
      },
      {
        body: t.Object({
          messages: t.Array(
            createInsertSchema(llmMessage, {
              attachments: t.Optional(t.Any()),
            })
          ),
        }),
      }
    );
});
