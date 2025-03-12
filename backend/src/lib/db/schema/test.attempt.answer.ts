import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { ulid } from "ulidx";
import { testAttempt } from "./test.attempt";
import { question } from "./question";
import { relations } from "drizzle-orm";
import { MEDIA_TYPES } from "../../../types/media";

export const testAttemptAnswer = pgTable("test_attempt_answer", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => "taa-" + ulid()),
  attemptId: varchar("attempt_id").references(() => testAttempt.id),
  questionId: varchar("question_id").references(() => question.id),
  answerText: text("answer_text"),
  answerOptions: jsonb("answer_options").$type<
    string[]
  >(),
  answerMediaUrl: varchar("answer_media_url", { length: 512 }),
  answerMediaType: varchar("answer_media_type", {
    length: 20,
    enum: MEDIA_TYPES,
  }),
  changeCount: integer("change_count").notNull().default(0),
  isCorrect: boolean("is_correct"),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deleted_at", {
    mode: "string",
    withTimezone: true,
  }),
}, (t) => ({
  uniqueAttemptQuestion: uniqueIndex("unique_attempt_question").on(
    t.attemptId,
    t.questionId
  ),
  attemptIdIndex: index("attempt_id_index").on(
    t.attemptId
  ),
}));

export const testAttemptAnswerRelations = relations(
  testAttemptAnswer,
  ({ one }) => ({
    attempt: one(testAttempt, {
      fields: [testAttemptAnswer.attemptId],
      references: [testAttempt.id],
    }),
    question: one(question, {
      fields: [testAttemptAnswer.questionId],
      references: [question.id],
    }),
  })
);
