import db from "../../../lib/db";

export async function getAllSessionByTestId(testId: string) {
  const sessions = await db.query.testSession.findMany({
    orderBy(fields, operators) {
      return operators.asc(fields.order);
    },
    where(fields, { isNull, and, eq }) {
      return and(eq(fields.testId, testId), isNull(fields.deletedAt));
    },
  });

  return { sessions };
}
