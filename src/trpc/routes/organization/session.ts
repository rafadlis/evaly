import { zodUpdateTestSession } from "@/lib/db/schema/test.session";
import { createSession } from "@/services/organization/test-session/create-session";
import { deleteSessionById } from "@/services/organization/test-session/delete-session-by-id";
import { getAllSessionByTestId } from "@/services/organization/test-session/get-all-session-by-test-id";
import { getSessionById } from "@/services/organization/test-session/get-session-by-id";
import { updateOrderSession } from "@/services/organization/test-session/update-order-session";
import { updateSession } from "@/services/organization/test-session/update-session";
import { organizerProcedure, router } from "@/trpc/trpc";
import { z } from "zod";

export const sessionRouter = router({
  // Get all session by testId
  sessionByTestId: organizerProcedure
    .input(
      z.object({
        testId: z.string(),
      })
    )
    .query(async ({ input }) => await getAllSessionByTestId(input.testId)),

  // Create new session
  create: organizerProcedure
    .input(
      z.object({
        testId: z.string({ message: "TestId is required" }),
      })
    )
    .mutation(async ({ input }) => await createSession(input.testId)),

  // Delete session
  delete: organizerProcedure
    .input(
      z.object({
        sessionId: z.string({ message: "SessionId is required" }),
      })
    )
    .mutation(async ({ input }) => {
      return await deleteSessionById(input.sessionId);
    }),

  byId: organizerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => (await getSessionById(input.id)) || null),

  update: organizerProcedure
    .input(
      z.object({
        sessionId: z.string(),
        data: zodUpdateTestSession,
      })
    )
    .mutation(
      async ({ input }) => await updateSession(input.sessionId, input.data)
    ),

  updateOrder: organizerProcedure
    .input(
      z.object({
        sessionIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => await updateOrderSession(input.sessionIds)),
});
