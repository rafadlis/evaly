import Elysia, { t } from "elysia";
import { organizationMiddleware } from "../../middlewares/auth.middleware";
import { getAllTestsByOrganizationId } from "../../services/organization/test/get-all-tests-by-organization-id";
import { createNewTest } from "../../services/organization/test/create-new-test";
import { getTestById } from "../../services/organization/test/get-test-by-id";
import { updateTest } from "../../services/organization/test/update-test";
import { createUpdateSchema } from "drizzle-typebox";
import { test } from "../../lib/db/schema";
import { checkTestOwner } from "../../services/organization/test/check-test-owner";
import { addInvitationTest } from "../../services/organization/test/add-invitation-test";
import { getInvitationListTest } from "../../services/organization/test/get-invitation-list-test";
import { deleteInvitationTest } from "../../services/organization/test/delete-invitation-test";
import { validateTestIsPublishable } from "../../services/organization/test/validate-test-is-publishable";
import { publishUnpublishTest } from "../../services/organization/test/publish-unpublish";
import { deleteTest } from "../../services/organization/test/delete-test";
import { testSectionRouter } from "./test.section.router";
import { reopenTest } from "../../services/organization/test/re-open-test";
import { getTestSubmissions } from "../../services/organization/test/get-test-submissions";
import { getSubmissionDetailsByEmail } from "../../services/organization/test/get-submission-details-by-email";
import swagger from "@elysiajs/swagger";

export const testRouter = new Elysia().group("/test", (app) => {
  return (
    app
      .derive(organizationMiddleware)
      .use(swagger())

      // Get All Tests
      .get(
        "/all",
        async ({ query, organizer }) => {
          const organizationId = organizer.organizationId;
          return await getAllTestsByOrganizationId({
            organizationId,
            page: query.page,
            limit: query.limit,
          });
        },
        {
          query: t.Object({
            page: t.Number({ default: 1 }),
            limit: t.Number({ default: 20 }),
          }),
          tags: ["Test"],
        }
      )

      // Create New Test
      .post(
        "/create",
        async ({ body, organizer }) => {
          const createdByOrganizerId = organizer.id;
          const organizationId = organizer.organizationId;

          return await createNewTest({
            createdByOrganizerId,
            organizationId,
            type: body.type,
          });
        },
        {
          body: t.Object({
            type: t.UnionEnum(["live", "self-paced"]),
          }),
          tags: ["Test"],
        }
      )

      // Get Test By Id
      .get(
        "/:id",
        async ({ params, organizer, error }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;
          const data = await getTestById({
            organizationId,
            id: testId,
          });

          if (!data) {
            return error("Not Found", "Test not found");
          }

          return data;
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          tags: ["Test"],
        }
      )

      // Update Test
      .put(
        "/:id",
        async ({ params, body, organizer }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;

          return await updateTest({
            organizationId,
            id: testId,
            data: body,
          });
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: createUpdateSchema(test, {}),
          tags: ["Test"],
        }
      )

      // Add Invitation Test
      .post(
        "/:id/invitation",
        async ({ params, body, organizer }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;

          await checkTestOwner(testId, organizationId);
          const res = await addInvitationTest(testId, body.emails);
          return { data: res };
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            emails: t.Array(t.String({ format: "email" }), {
              minItems: 1,
            }),
          }),
          tags: ["Test"],
        }
      )

      // Get Invitation List Test
      .get(
        "/:id/invitation",
        async ({ params, organizer }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;

          await checkTestOwner(testId, organizationId);
          const listInvitation = await getInvitationListTest(testId);
          return {
            data: listInvitation,
          };
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          tags: ["Test"],
        }
      )

      // Delete Invitation Test
      .delete(
        "/:id/invitation/:email",
        async ({ params, organizer }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;
          const email = params.email;

          await checkTestOwner(testId, organizationId);
          const res = await deleteInvitationTest(testId, email);
          return { data: res };
        },
        {
          params: t.Object({
            id: t.String(),
            email: t.String({ format: "email" }),
          }),
          tags: ["Test"],
        }
      )

      // Validate Test is Publishable
      .get(
        "/:id/validate-publish",
        async ({ params, organizer }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;

          await checkTestOwner(testId, organizationId);
          const res = await validateTestIsPublishable(testId, organizationId);
          return { data: res };
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          tags: ["Test"],
        }
      )

      // Publish test
      .put(
        "/:id/publish",
        async ({ params, organizer, error }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;

          await checkTestOwner(testId, organizationId);
          const { isPublishable } = await validateTestIsPublishable(
            testId,
            organizationId
          );

          if (!isPublishable) {
            return error("Bad Request", "Test is not publishable");
          }

          const res = await publishUnpublishTest(testId, true);
          return { data: res };
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          tags: ["Test"],
        }
      )

      // Unpublish test
      .put(
        "/:id/unpublish",
        async ({ params, organizer, error }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;

          await checkTestOwner(testId, organizationId);
          const res = await publishUnpublishTest(testId, false);
          return { data: res };
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          tags: ["Test"],
        }
      )
      .use(testSectionRouter)

      // Delete Test
      .delete(
        "/:id",
        async ({ params, organizer }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;

          await checkTestOwner(testId, organizationId);
          const res = await deleteTest(testId);
          return { data: res };
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          tags: ["Test"],
        }
      )

      // Re-open test
      .put(
        "/:id/reopen",
        async ({ params, organizer }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;

          await checkTestOwner(testId, organizationId);
          const res = await reopenTest(testId);

          return res;
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          tags: ["Test"],
        }
      )

      // Get Test Submissions
      .get("/:id/submissions", async ({ params, organizer }) => {
        const organizationId = organizer.organizationId;
        const testId = params.id;

        await checkTestOwner(testId, organizationId);
        const res = await getTestSubmissions(testId);

        return res;
      },{
        params: t.Object({
          id: t.String(),
        }),
        tags: ["Test"],
      })

      // Get Submission Details by Email
      .get(
        "/:id/submissions/:email",
        async ({ params, organizer, error }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;
          const email = params.email;

          await checkTestOwner(testId, organizationId);
          const res = await getSubmissionDetailsByEmail(testId, email);

          if (!res) {
            return error("Not Found", "Submission not found");
          }

          return res;
        },
        {
          params: t.Object({
            id: t.String(),
            email: t.String(),
          }),
          tags: ["Test"],
        }
      )
  );
});
