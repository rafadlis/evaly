import { z } from "zod";
import { organizerProcedure, router } from "../../trpc";
import { createNewTest } from "@/services/organization/test/create-new-test";
import { getAllTestsByOrganizationId } from "@/services/organization/test/get-all-tests-by-organization-id";

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
});
