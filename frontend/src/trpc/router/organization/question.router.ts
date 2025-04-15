import { question } from "@/lib/db/schema";
import { checkQuestionOwner } from "@/services/organization/question/check-question-owner";
import { createQuestion } from "@/services/organization/question/create-question";
import { deleteQuestion } from "@/services/organization/question/delete-question";
import { getAllQuestionByReferenceId } from "@/services/organization/question/get-all-question-by-reference-id";
import { transferBetweenReference } from "@/services/organization/question/transfer-question-between-reference";
import { updateOrderBetweenQuestions } from "@/services/organization/question/update-order-between-questions";
import { updateQuestion } from "@/services/organization/question/update-question";
import { organizerProcedure, router } from "@/trpc";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const questionRouter = router({
  getAll: organizerProcedure
    .input(
      z.object({
        referenceId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getAllQuestionByReferenceId(input.referenceId);
    }),

  create: organizerProcedure
    .input(
      z.object({
        referenceId: z.string(),
        questions: z.array(createInsertSchema(question)),
      })
    )
    .mutation(async ({ input }) => {
      return await createQuestion(input.referenceId, input.questions);
    }),

  update: organizerProcedure
    .input(
      z.object({
        id: z.string(),
        data: createUpdateSchema(question),
      })
    )
    .mutation(async ({ input }) => {
      return await updateQuestion(input.id, input.data);
    }),

  delete: organizerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await deleteQuestion(input.id);
    }),

  updateOrder: organizerProcedure
    .input(
      z.array(
        z.object({
          questionId: z.string(),
          order: z.number(),
        })
      )
    )
    .mutation(
      async ({
        input,
        ctx: {
          organizer: { organizationId },
        },
      }) => {
        await checkQuestionOwner(
          input.map((item) => item.questionId),
          organizationId
        );

        const isUpdated = await updateOrderBetweenQuestions(input);

        if (!isUpdated) {
          throw new Error("Failed to update order");
        }

        return { message: "Order updated successfully" };
      }
    ),

  transferBetweenReference: organizerProcedure
    .input(
      z.object({
        fromReferenceId: z.string(),
        toReferenceId: z.string(),
        order: z.number(),
      })
    )
    .mutation(
      async ({
        input,
        ctx: {
          organizer: { organizationId },
        },
      }) => {
        return await transferBetweenReference({ ...input, organizationId });
      }
    ),
});
