import { and, count, eq, isNull } from "drizzle-orm/sql";
import db from "../../../lib/db";
import { question } from "../../../lib/db/schema";

export async function getSessionById(sessionId: string) {
  const session = await db.query.testSession.findFirst({
    where(fields, { and, eq, isNull }) {
      return and(eq(fields.id, sessionId), isNull(fields.deletedAt));
    },
  });

  const numOfQuestions = await db
    .select({
      count: count(),
    })
    .from(question)
    .where(
      and(eq(question.referenceId, sessionId), isNull(question.deletedAt))
    );
  return {
    ...session,
    numOfQuestions: numOfQuestions[0]?.count,
  };
}
