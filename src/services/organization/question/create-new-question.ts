import db from "@/lib/db";
import { question } from "@/lib/db/schema";
import { and, eq, gte, ne, sql } from "drizzle-orm";

export async function createNewQuestion(referenceId: string, order: number) {
  const insertNewQuestion = await db
    .insert(question)
    .values({
      referenceId,
      order: order,
    })
    .returning();
  const newQuestionId = insertNewQuestion.at(0)?.id || "";

  //update order of other question
  await db
    .update(question)
    .set({
      order: sql`${question.order}+1`,
    })
    .where(
      and(
        ne(question.id, newQuestionId),
        gte(question.order, order),
        eq(question.referenceId, referenceId)
      )
    );

  return insertNewQuestion;
}
