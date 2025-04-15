import { getAllQuestionByReferenceId } from "@/services/organization/question/get-all-question-by-reference-id";
import { organizerProcedure, router } from "@/trpc";
import { z } from "zod";

export const questionRouter = router({
  getAll: organizerProcedure.input(z.object({
    referenceId: z.string(),
  })).query(async ({ input }) => {
    return await getAllQuestionByReferenceId(input.referenceId);
  }),
});