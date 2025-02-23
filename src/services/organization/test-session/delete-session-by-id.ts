import db from "@/lib/db";
import { question, testSession } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function deleteSessionById(sessionId: string) {
  const deleteSession = await db
    .update(testSession)
    .set({
      deletedAt: new Date().toISOString(),
      order: null
    })
    .where(eq(testSession.id, sessionId))
    .returning();

  const deleteQuestions = await db
    .update(question)
    .set({
      deletedAt: new Date().toISOString(),
    })
    .where(eq(question.referenceId, sessionId))
    .returning();

  return {
    sessionRowChanges: deleteSession.length,
    questionRowChanges: deleteQuestions.length,
  };
}
