import Elysia, { t } from "elysia";
import { organizationMiddleware } from "../../middlewares/auth.middleware";
import { createInsertSchema, createUpdateSchema } from "drizzle-typebox";
import { testSection } from "../../lib/db/schema";
import { updateSection } from "../../services/organization/test-section/update-section";
import { getAllSectionByTestId } from "../../services/organization/test-section/get-all-section-by-test-id";
import { createSection } from "../../services/organization/test-section/create-section";
import { deleteSectionById } from "../../services/organization/test-section/delete-section-by-id";
import { getSectionById } from "../../services/organization/test-section/get-section-by-id";
import { updateOrderSection } from "../../services/organization/test-section/update-order-section";

export const testSectionRouter = new Elysia().group("/section", (app) => {
  return (
    app
      .derive(organizationMiddleware)

      // Get All Sections by Test Id
      .get(
        "/all",
        async ({ query }) => await getAllSectionByTestId(query.testId),
        {
          query: t.Object({
            testId: t.String({
              description: "Test ID is required",
            }),
          }),
        }
      )

      // Create New Section
      .post("/create", async ({ body }) => await createSection(body.testId), {
        body: t.Pick(createInsertSchema(testSection, {}), ["testId"]),
      })

      // Delete Section
      .delete(
        "/:id/delete",
        async ({ params }) => await deleteSectionById(params.id),
        {
          params: t.Object({
            id: t.String({
              description: "Section ID is required",
            }),
          }),
        }
      )

      // Get Section By Id
      .get(
        "/:id",
        async ({ params }) => await getSectionById(params.id),
        {
          params: t.Object({
            id: t.String({
              description: "Section ID is required",
            }),
          }),
        }
      )

      // Update Section
      .put(
        "/:id",
        async ({ params, body }) => await updateSection(params.id, body),
        {
          params: t.Object({ id: t.String() }),
          body: createUpdateSchema(testSection, {}),
        }
      )

      // Update Order of Section
      .put(
        "/order",
        async ({ body }) => await updateOrderSection(body.testId, body.order),
        {
          body: t.Object({
            testId: t.String({
              description: "Test ID is required",
            }),
            order: t.Array(t.String({
              description: "Section ID is required",
            })),
          }),
        }
      )
  );
});
