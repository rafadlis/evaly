import { getAllSectionByTestId } from "@/services/organization/test-section/get-all-section-by-test-id";
import { getSectionById } from "@/services/organization/test-section/get-section-by-id";
import { organizerProcedure, router } from "@/trpc";
import { z } from "zod";

export const testSectionRouter = router({
  getAll: organizerProcedure
    .input(
      z.object({
        testId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const testId = input.testId;

      return await getAllSectionByTestId(testId);
    }),

  getById: organizerProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      return await getSectionById(input.id);
    }),
});
