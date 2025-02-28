import db from "@/lib/db";
import { question, testSession } from "@/lib/db/schema";
import { and, eq, gte, ne, sql } from "drizzle-orm";

export async function deleteSessionById(sessionId: string) {
  const sessionOrder = (await db.query.testSession.findFirst({
    columns: {
      order: true,
    },
    where(fields, operators) {
      return operators.eq(fields.id, sessionId);
    },
  }))?.order;

  const deleteSession = await db
    .update(testSession)
    .set({
      deletedAt: new Date().toISOString(),
      order: null,
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

  // Change the order of the sessions
  if (deleteSession[0] && sessionOrder) {
    await db
      .update(testSession)
      .set({
        order: sql`${testSession.order} - 1`,
      })
      .where(
        and(
          eq(testSession.testId, deleteSession[0].testId),
          ne(testSession.id, sessionId),
          gte(testSession.order, sessionOrder)
        )
      );
  }

  return {
    sessionRowChanges: deleteSession.length,
    questionRowChanges: deleteQuestions.length,
  };
}
