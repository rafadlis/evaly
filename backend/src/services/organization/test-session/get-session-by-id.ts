import db from "../../../lib/db";

export async function getSessionById(sessionId: string) {
  return await db.query.testSession.findFirst({
    where(fields, { and, eq, isNull }) {
      return and(eq(fields.id, sessionId), isNull(fields.deletedAt));
    },
  });
}
