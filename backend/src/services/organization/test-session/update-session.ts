import db from "../../../lib/db";
import { testSession, UpdateTestSession } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";

export async function updateSession(
  sessionId: string,
  data: UpdateTestSession
) {
  const session = await db
    .update(testSession)
    .set(data)
    .where(eq(testSession.id, sessionId))
    .returning();

  return session;
}
