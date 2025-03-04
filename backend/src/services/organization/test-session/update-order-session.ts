import db from "../../../lib/db";
import { testSession } from "../../../lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function updateOrderSession(testId: string, sessionIds: string[]) {
  await Promise.all(
    sessionIds.map(async (id, index) => {
      await db
        .update(testSession)
        .set({
          order: index + 1, // +1 because order is 1-based
        })
        .where(and(eq(testSession.id, id), eq(testSession.testId, testId)));
    })
  );
}
