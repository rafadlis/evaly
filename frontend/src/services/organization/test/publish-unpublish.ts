import { eq } from "drizzle-orm/sql";
import db from "../../../lib/db";
import { test } from "../../../lib/db/schema";

export async function publishUnpublishTest(
  testId: string,
  isPublished: boolean
) {
  const updatedTest = await db.update(test).set({ isPublished }).where(eq(test.id, testId)).returning()
  return updatedTest[0]
}
