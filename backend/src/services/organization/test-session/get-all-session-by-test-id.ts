import { and, count, eq, isNull } from "drizzle-orm/sql";
import db from "../../../lib/db";
import { question, testSession } from "../../../lib/db/schema";

export async function getAllSessionByTestId(testId: string) {
  // const sessions = await db.query.testSession.findMany({
  //   with: {
  //     question: {
  //       columns: {
  //         id: true,
  //       },
  //     },
  //   },
  //   extras: {
  //     numOfQuestions: count(question.id),
  //   }
  //   orderBy(fields, operators) {
  //     return operators.asc(fields.order);
  //   },
  //   where(fields, { isNull, and, eq }) {
  //     return and(eq(fields.testId, testId), isNull(fields.deletedAt));
  //   },
  // });

  const data = await db
    .select({
      testSession,
      numOfQuestions: count(question.id),
    })
    .from(testSession)
    .where(and(eq(testSession.testId, testId), isNull(testSession.deletedAt)))
    .leftJoin(question, eq(testSession.id, question.referenceId))
    .groupBy(testSession.id)
    .orderBy(testSession.order);

  const finalData = data.map((item) => {
    return {
      ...item.testSession,
      numOfQuestions: item.numOfQuestions,
    };
  });
  return {
    sessions: finalData,
  };
}
