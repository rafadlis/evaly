import { zodUpdateQuestion } from "@/lib/db/schema";
import { zodQuestionType } from "@/lib/db/schema/question";
import { createQuestion } from "@/services/organization/question/create-question";
import { deleteQuestion } from "@/services/organization/question/delete-question";
import { getAllQuestionByReferenceId } from "@/services/organization/question/get-all-question-by-reference-id";
import { updateQuestion } from "@/services/organization/question/update-question";
import { organizerProcedure, router } from "@/trpc/trpc";
import { z } from "zod";

export const questionRouter = router({
  create: organizerProcedure
    .input(
      zodUpdateQuestion.extend({
        referenceId: z.string({ message: "ReferenceId is required" }),
        order: z.number({ message: "Order is required" }),
        type: zodQuestionType,
      })
    )
    .mutation(async ({ input }) => {
      return await createQuestion(input.referenceId, input.order, input.type);
    }),

  allByReferenceId: organizerProcedure
    .input(
      z.object({
        referenceId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getAllQuestionByReferenceId(input.referenceId);
    }),

  update: organizerProcedure
    .input(
      z.object({
        questionId: z.string(),
        data: zodUpdateQuestion,
      })
    )
    .mutation(async ({ input }) => {
      return await updateQuestion(input.questionId, input.data);
    }),

  delete: organizerProcedure
    .input(z.object({ questionId: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteQuestion(input.questionId);
    }),
});
