import Elysia, { t } from "elysia";
import { organizationMiddleware } from "../../middlewares/auth.middleware";
import { createQuestionTemplate } from "../../services/organization/question/create-question-template";
import { getAllQuestionTemplate } from "../../services/organization/question/get-all-question-template";
import { getQuestionTemplateById } from "../../services/organization/question/get-question-template-by-id";
import { deleteQuestionTemplate } from "../../services/organization/question/delete-question-template";
import { updateQuestionTemplate } from "../../services/organization/question/update-question-template";
import { createUpdateSchema } from "drizzle-typebox";
import { questionTemplate } from "../../lib/db/schema";
import { swagger } from "@elysiajs/swagger";

export const questionTemplateRouter = new Elysia().group("/template", (app) =>
  app
    .derive(organizationMiddleware)
    .use(swagger())

    // Create new question template
    .post(
      "/create",
      async ({ organizer: { organizationId, id }, body, error }) => {
        return await createQuestionTemplate(
          {
            organizationId,
            organizerId: id,
            title: body.title,
          },
          body.withInitialQuestion
        );
      },
      {
        body: t.Object({
          withInitialQuestion: t.Boolean({
            default: true,
          }),
          title: t.Optional(t.String()),
        }),
        tags: ["Question Template"],
      }
    )

    // Get all question template
    .get("/all", async ({ organizer: { organizationId } }) => {
      return await getAllQuestionTemplate(organizationId);
    }, {
      tags: ["Question Template"],
    })

    // Get question template by id
    .get("/:id", async ({ params, organizer: { organizationId } }) => {
      return await getQuestionTemplateById(params.id, organizationId);
    }, {
      params: t.Object({
        id: t.String(),
      }),
      tags: ["Question Template"],
    })

    // Delete question template
    .delete("/:id", async ({ params, organizer: { organizationId } }) => {
      return await deleteQuestionTemplate(params.id, organizationId);
    }, {
      params: t.Object({
        id: t.String(),
      }),
      tags: ["Question Template"],
    })

    // Update question template
    .put(
      "/:id",
      async ({ params, body, organizer: { organizationId } }) => {
        return await updateQuestionTemplate(params.id, organizationId, body);
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: createUpdateSchema(questionTemplate, { aiContents: t.Any() }),
        tags: ["Question Template"],
      }
    )
);
