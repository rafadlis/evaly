import db from "@/lib/db";
import { testSession } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function updateOrderSession(sessionIds: string[]) {
  await Promise.all(
    sessionIds.map(async (id, index) => {
      await db
        .update(testSession)
        .set({
          order: index + 1, // +1 because order is 1-based
        })
        .where(eq(testSession.id, id));
    })
  );
}
