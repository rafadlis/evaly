import db from "@/lib/db";
import { test } from "@/lib/db/schema";

export async function createNewTest(data: typeof test.$inferInsert) {
  const insertTest = await db.insert(test).values(data).returning();
  return insertTest.at(0);
}
