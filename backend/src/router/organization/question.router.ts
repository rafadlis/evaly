import Elysia, { t } from "elysia";
import { organizationMiddleware } from "../../middlewares/auth.middleware";
import { createQuestion } from "../../services/organization/question/create-question";
import { getAllQuestionByReferenceId } from "../../services/organization/question/get-all-question-by-reference-id";
import { updateQuestion } from "../../services/organization/question/update-question";
import { deleteQuestion } from "../../services/organization/question/delete-question";
import { checkQuestionOwner } from "../../services/organization/question/check-question-owner";
import { updateOrderBetweenQuestions } from "../../services/organization/question/update-order-between-questions";
import {
  ValidatedInsertQuestion,
  ValidatedUpdateQuestion,
} from "../../types/question";
import { questionTemplateRouter } from "./question.template.router";
import { llmRouter } from "./llm.router";
import { createBulkFromTemplate } from "../../services/organization/question/create-bulk-from-template";
import swagger from "@elysiajs/swagger";

export const questionRouter = new Elysia().group("/question", (app) => {
  return (
    app
      .derive(organizationMiddleware)
      .use(swagger())

      // Create Question
      .post(
        "/create",
        async ({ body, organizer: { organizationId }, error }) => {
          const inputQuestions = body.map((question) => ({
            ...question,
            organizationId: organizationId,
          }));
          
          const questions = await createQuestion(inputQuestions);

          if (questions.length !== body.length) {
            return error(400, "Failed to create question");
          }

          return { questions };
        },
        {
          body: t.Array(ValidatedInsertQuestion),
          tags: ["Question"],
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
          tags: ["Question"],
        }
      )

      // Update Question
      .put(
        "/update/:id",
        async ({ body, params }) => {
          return await updateQuestion(params.id, body);
        },
        {
          body: ValidatedUpdateQuestion,
          params: t.Object({ id: t.String() }),
          tags: ["Question"],
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
          tags: ["Question"],
        }
      )

      // Update Order between two questions
      .put(
        "/update-order",
        async ({ body, organizer: { organizationId }, error }) => {
          await checkQuestionOwner(
            body.map((question) => question.questionId),
            organizationId
          );

          const isUpdated = await updateOrderBetweenQuestions(body);

          if (!isUpdated) {
            return error(400, "Failed to update order");
          }

          return { message: "Order updated successfully" };
        },
        {
          body: t.Array(
            t.Object({
              questionId: t.String(),
              order: t.Number(),
            })
          ),
          tags: ["Question"],
        }
      )

      // Add-bulk from template
      .post(
        "/add-from-template",
        async ({ body, organizer, error }) => {
          const organizationId = organizer.organizationId;
          try {
            return await createBulkFromTemplate({
              ...body,
              organizationId,
            });
          } catch (errorBody) {
            return error(
              "Internal Server Error",
              errorBody instanceof Error ? errorBody.message : null
            );
          }
        },
        {
          body: t.Object({
           fromReferenceId: t.String(),
           toReferenceId: t.String(),
            order: t.Number(), // Need to insert in the middle
          }),
          tags: ["Question"],
        }
      )

      .use(questionTemplateRouter)
      .use(llmRouter)
  );
});
