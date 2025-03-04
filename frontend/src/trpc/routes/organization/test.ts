import { z } from "zod";
import { organizerProcedure, router } from "../../trpc";
import { createNewTest } from "@/services/organization/test/create-new-test";
import { getAllTestsByOrganizationId } from "@/services/organization/test/get-all-tests-by-organization-id";
import { updateTest } from "@/services/organization/test/update-test";
import { zodUpdateTest } from "@/lib/db/schema";
import { getTestById } from "@/services/organization/test/get-test-by-id";

export const testRouter = router({
  // Find all test
  all: organizerProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const organizationId = ctx.organizer.organizationId;
      return await getAllTestsByOrganizationId({
        organizationId,
        limit: input.limit,
        page: input.page,
      });
    }),

  // Create a new test
  create: organizerProcedure
    .input(
      z.object({
        type: z.enum(["live", "self-paced"]),
      })
    )
    .mutation(async ({ input, ctx: { organizer } }) => {
      const createdByOrganizerId = organizer.id;
      const organizationId = organizer.organizationId;

      return await createNewTest({
        createdByOrganizerId,
        organizationId,
        type: input.type,
      });
    }),

  // Get a test by id
  byId: organizerProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx: { organizer } }) => {
      const organizationId = organizer.organizationId;
      return await getTestById({ id: input.id, organizationId });
    }),

  // Update a test
  update: organizerProcedure
    .input(z.object({ id: z.string(), data: zodUpdateTest }))
    .mutation(async ({ input, ctx: { organizer } }) => {
      const organizationId = organizer.organizationId;
      return await updateTest({
        id: input.id,
        data: input.data,
        organizationId,
      });
    }),
});
