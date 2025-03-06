import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import { question } from "../lib/db/schema/question";
export type { QuestionType } from "./question-types";

export type Question = typeof question.$inferSelect;
export type InsertQuestion = typeof question.$inferInsert;
export type UpdateQuestion = Partial<InsertQuestion>;

export const ValidatedInsertQuestion = createInsertSchema(question, {
  options: t.Optional(
    t.Nullable(
      t.Array(
        t.Object({
          id: t.String(),
          text: t.String(),
          isCorrect: t.Boolean(),
          mediaUrl: t.Optional(t.String({ format: "uri" })),
          mediaType: t.Optional(
            t.Union([
              t.Literal("image"),
              t.Literal("video"),
              t.Literal("audio"),
              t.Literal("file"),
            ])
          ),
          pointValue: t.Optional(t.Number({ minimum: 0 })),
        })
      )
    )
  ),
});
