import { test } from "@/lib/db/schema";
import { checkTestOwner } from "@/services/organization/test/check-test-owner";
import { createNewTest } from "@/services/organization/test/create-new-test";
import { deleteTest } from "@/services/organization/test/delete-test";
import { getAllTestsByOrganizationId } from "@/services/organization/test/get-all-tests-by-organization-id";
import { getTestById } from "@/services/organization/test/get-test-by-id";
import { updateTest } from "@/services/organization/test/update-test";
import { organizerProcedure, router } from "@/trpc";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const testRouter = router({
  getAll: organizerProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx: { organizer }, input }) => {
      const organizationId = organizer.organizationId;
      return await getAllTestsByOrganizationId({
        organizationId,
        page: input.page,
        limit: input.limit,
      });
    }),

  create: organizerProcedure
    .input(
      z.object({
        type: z.enum(["live", "self-paced"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const createdByOrganizerId = ctx.organizer.id;
      const organizationId = ctx.organizer.organizationId;

      return await createNewTest({
        createdByOrganizerId,
        organizationId,
        type: input.type,
      });
    }),

  getById: organizerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ctx, input}) => {
        const organizationId = ctx.organizer.organizationId;
        const testId = input.id;

        return await getTestById({
            organizationId,
            id: testId,
        });
    }),

  update: organizerProcedure
    .input(createInsertSchema(test))
    .mutation(async ({ctx, input}) => {
        const organizationId = ctx.organizer.organizationId;
        const testId = input.id;

        if (!testId) {
            throw new Error("Test ID is required");
        }
        
        return await updateTest({
            organizationId,
            id: testId,
            data: input,
        })
    }),

  delete: organizerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ctx, input}) => {
        const organizationId = ctx.organizer.organizationId;
        const testId = input.id;

        if (!testId) {
            throw new Error("Test ID is required");
        }

        await checkTestOwner(testId, organizationId);
        return await deleteTest(testId);
    }),

  invite: organizerProcedure
    .input(
      z.object({
        id: z.string(),
        emails: z.array(z.string().email()),
      })
    )
    .mutation(async () => {}),

  getInvites: organizerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async () => {}),

  deleteInvite: organizerProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async () => {}),

  isPublishable: organizerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async () => {}),

  publish: organizerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async () => {}),

  unpublish: organizerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async () => {}),

  duplicateTest: organizerProcedure // aka re-open test
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async () => {}),

  getTestResults: organizerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async () => {}),

  getTestResultsByParticipant: organizerProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email(),
      })
    )
    .query(async () => {}),
});
