import Elysia, { t } from "elysia";
import { organizationMiddleware } from "../../middlewares/auth.middleware";
import { getAllSessionByTestId } from "../../services/organization/test-session/get-all-session-by-test-id";
import { createSession } from "../../services/organization/test-session/create-session";
import { createInsertSchema, createUpdateSchema } from "drizzle-typebox";
import { testSession } from "../../lib/db/schema";
import { deleteSessionById } from "../../services/organization/test-session/delete-session-by-id";
import { getSessionById } from "../../services/organization/test-session/get-session-by-id";
import { updateSession } from "../../services/organization/test-session/update-session";
import { updateOrderSession } from "../../services/organization/test-session/update-order-session";

export const testSessionRouter = new Elysia().group("/session", (app) => {
  return (
    app
      .derive(organizationMiddleware)

      // Get All Sessions by Test Id
      .get(
        "/all",
        async ({ query }) => await getAllSessionByTestId(query.testId),
        {
          query: t.Object({
            testId: t.String({
              description: "Test ID is required",
            }),
          }),
        }
      )

      // Create New Session
      .post("/create", async ({ body }) => await createSession(body.testId), {
        body: t.Pick(createInsertSchema(testSession, {}), ["testId"]),
      })

      // Delete session
      .delete(
        "/:id/delete",
        async ({ params }) => await deleteSessionById(params.id),
        {
          params: t.Object({
            id: t.String({
              description: "Session ID is required",
            }),
          }),
        }
      )

      // Get Session By Id
      .get(
        "/:id",
        async ({ params }) => await getSessionById(params.id),
        {
          params: t.Object({
            id: t.String({
              description: "Session ID is required",
            }),
          }),
        }
      )

      // Update Session
      .put(
        "/:id",
        async ({ params, body }) => await updateSession(params.id, body),
        {
          params: t.Object({ id: t.String() }),
          body: createUpdateSchema(testSession, {}),
        }
      )

      // Update Order of Session
      .put(
        "/order",
        async ({ body }) => await updateOrderSession(body.testId, body.order),
        {
          body: t.Object({
            testId: t.String({
              description: "Test ID is required",
            }),
            order: t.Array(t.String({
              description: "Session ID is required",
            })),
          }),
        }
      )
  );
});
