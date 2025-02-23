import { createSession } from "@/services/organization/test-session/create-session";
import { deleteSessionById } from "@/services/organization/test-session/delete-session-by-id";
import { getAllSessionByTestId } from "@/services/organization/test-session/get-all-session-by-test-id";
import { getSessionById } from "@/services/organization/test-session/get-session-by-id";
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
    .query(async ({ input }) => await getSessionById(input.id)),
});
