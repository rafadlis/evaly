import db from "@/lib/db";
import { test, UpdateTest } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function updateTest({
  id,
  data,
  organizationId,
}: {
  id: string;
  data: UpdateTest;
  organizationId: string;
}) {
  const updateTest = await db
    .update(test)
    .set(data)
    .where(and(eq(test.id, id), eq(test.organizationId, organizationId)))
    .returning();

  return updateTest[0];
}
