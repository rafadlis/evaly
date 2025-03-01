import { zodUpdateQuestion } from "@/lib/db/schema";
import { createNewQuestion } from "@/services/organization/question/create-new-question";
import { getAllQuestionByReferenceId } from "@/services/organization/question/get-all-question-by-reference-id";
import { updateQuestion } from "@/services/organization/question/update-question";
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
  
  update: organizerProcedure
    .input(
      z.object({
        questionId: z.string(),
        data: zodUpdateQuestion
      })
    )
    .mutation(async ({ input }) => {
      return await updateQuestion(input.questionId, input.data);
    }),
});