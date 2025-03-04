import db from "../../../lib/db";
import { testSession } from "../../../lib/db/schema";
import { and, eq, isNull, sql } from "drizzle-orm/sql";

export async function createSession(testId: string) {
  const [{ count }] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(testSession)
    .where(and(eq(testSession.testId, testId), isNull(testSession.deletedAt)));

  const sessions = await db
    .insert(testSession)
    .values({ testId, order: Number(count) + 1 })
    .returning();

  return { sessions };
}
