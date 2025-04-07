import db from "../../../lib/db";
import { question, questionTemplate } from "../../../lib/db/schema";

export const createQuestionTemplate = async (
  body: typeof questionTemplate.$inferInsert,
  withInitialQuestion: boolean = true
) => {
  const dataCreated = await db
    .insert(questionTemplate)
    .values(body)
    .returning();

  if (!dataCreated || dataCreated.length === 0) {
    throw new Error("Failed to create question template");
  }

  if (withInitialQuestion) {
    await db.insert(question).values([
      {
        referenceId: dataCreated[0].id,
        order: 1,
        type: "text-field",
        organizationId: body.organizationId,
      },
    ]);
  }

  return dataCreated[0];
};
