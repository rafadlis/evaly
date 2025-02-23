import { createNewQuestion } from "@/services/organization/question/create-new-question";
import { getAllQuestionByReferenceId } from "@/services/organization/question/get-all-question-by-reference-id";
import { organizerProcedure, router } from "@/trpc/trpc";
import { z } from "zod";

export const questionRouter = router({
  create: organizerProcedure
    .input(
      z.object({
        referenceId: z.string({ message: "ReferenceId is required" }),
        order: z.number()
      })
    )
    .mutation(async ({ input }) => {
      return await createNewQuestion(input.referenceId, input.order);
    }),

  allByReferenceId: organizerProcedure
    .input(
      z.object({
        referenceId: z.string(),
      })
    )
    .query(async ({input}) => {
        return await getAllQuestionByReferenceId(input.referenceId)
    }),
});
