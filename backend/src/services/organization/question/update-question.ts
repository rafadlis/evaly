import db from "../../../lib/db";
import { question } from "../../../lib/db/schema/question";
import { eq } from "drizzle-orm";
import { UpdateQuestion } from "../../../types";

export async function updateQuestion(questionId: string, data: UpdateQuestion) {
  const updatedQuestion = await db
    .update(question)
    .set(data)
    .where(eq(question.id, questionId))
    .returning();
  
  return { updatedQuestion: updatedQuestion[0] };
}
