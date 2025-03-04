import Elysia, { t } from "elysia";
import { organizationMiddleware } from "../../middlewares/auth.middleware";
import { createInsertSchema, createUpdateSchema } from "drizzle-typebox";
import { question } from "../../lib/db/schema";
import { createQuestion } from "../../services/organization/question/create-question";
import { getAllQuestionByReferenceId } from "../../services/organization/question/get-all-question-by-reference-id";
import { updateQuestion } from "../../services/organization/question/update-question";
import { deleteQuestion } from "../../services/organization/question/delete-question";

export const questionRouter = new Elysia().group("/question", (app) => {
  return (
    app
      .derive(organizationMiddleware)

      // Create Question
      .post(
        "/create",
        async ({ body }) => {
          return await createQuestion(body.referenceId, body.order, body.type);
        },
        {
          body: createInsertSchema(question, {
            order: t.Number(),
          }),
        }
      )

      // Get All by Reference Id
      .get(
        "/all",
        async ({ query }) => {
          return await getAllQuestionByReferenceId(query.referenceId);
        },
        {
          query: t.Object({ referenceId: t.String() }),
        }
      )

      // Update Question
      .put(
        "/update/:id",
        async ({ body, params }) => {
          return await updateQuestion(params.id, body);
        },
        {
          body: createUpdateSchema(question, {}),
          params: t.Object({ id: t.String() }),
        }
      )

      // Delete Question
      .delete(
        "/:id",
        async ({ params }) => {
          await deleteQuestion(params.id);
          return { message: "Question deleted successfully" };
        },
        {
          params: t.Object({ id: t.String() }),
        }
      )
  );
});
