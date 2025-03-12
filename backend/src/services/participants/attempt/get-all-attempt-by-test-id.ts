import { eq } from "drizzle-orm";
import db from "../../../lib/db";
import { testAttempt } from "../../../lib/db/schema/test.attempt";

export async function getAllAttemptByTestId(testId: string) {
  const attempts = await db.query.testAttempt.findMany({
    where: eq(testAttempt.testId, testId),
  });

  return attempts;
}
