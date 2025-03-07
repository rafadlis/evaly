import db from "../../../lib/db";
import { question } from "../../../lib/db/schema";
import { and, eq, gte, ne, sql } from "drizzle-orm";
import { InsertQuestion, Question } from "../../../types/question";

export async function createQuestion(listQuestion: InsertQuestion[]) {
  return await db.transaction(async (tx) => {
    const listQuestionWithOptions: Question[] = [];
    for (const item of listQuestion) {
      const insertNewQuestion = await tx
        .insert(question)
        .values({
          ...item,
        })
        .returning();
      const insertedQuestion = insertNewQuestion.at(0);

      if (!insertedQuestion) {
        throw new Error("Failed to create question");
      }

      const newQuestionId = insertedQuestion.id;

      //update order of other question
      await tx
        .update(question)
        .set({
          order: sql`${question.order}+1`,
        })
        .where(
          and(
            ne(question.id, newQuestionId),
            gte(question.order, item.order || 1),
            eq(question.referenceId, item.referenceId)
          )
        );

      listQuestionWithOptions.push(insertedQuestion);
    }

    return listQuestionWithOptions;
  });
}
