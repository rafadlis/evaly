import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTable,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { ulid } from "ulidx";
import { testSession } from "./test.session";
import { createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

// Define question types as a constant that can be reused
export const QUESTION_TYPES = [
  "single-choice", // Participant selects 1 correct answer (radio buttons)
  "multiple-choice", // Participant can select more than 1 correct answer (checkboxes)
  "yes-or-no", // Simple binary choice (Yes/No)
  "point-based", // Answer earns points based on correctness
  "text-field", // Open-ended text response
  "file-upload", // Participant uploads a file as an answer
  "fill-the-blank", // Participant fills in missing words in a sentence
  "audio-response", // Participant records and submits an audio response
  "video-response", // Participant records and submits a video response
  "dropdown", // Single-choice selection from a dropdown menu
  "ranking", // Participants reorder options based on priority/preference
  "slider-scale", // Select a value on a sliding scale (e.g., 1-10)
  "date-picker", // Select a date from a calendar input
  "time-picker", // Select a specific time
  "image-choice", // Choose an answer by selecting an image
  "matching-pairs", // Drag & drop or dropdown-based matching of related terms
  "matrix", // Grid-based response format for rating multiple items at once
  "hotspot", // Click on a specific area in an image as the answer
  "formula-input", // Input mathematical expressions or equations
  "code-editor" // Answer by writing and submitting code (for programming assessments)
] as const;

// Create a Zod enum schema for question types
export const zodQuestionType = z.enum(QUESTION_TYPES);
export type QuestionType = z.infer<typeof zodQuestionType>;

export const question = pgTable(
  "question",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "qst-" + ulid()),
    question: text("question"),
    referenceId: varchar("reference_id", { length: 255 }).notNull(),
    order: smallint("order"),
    type: varchar("type", {
      length: 20,
      enum: QUESTION_TYPES
    }).default("multiple-choice"),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
    deletedAt: timestamp("deleted_at", {
      mode: "string",
      withTimezone: true,
    }),
  },
  (table) => ({
    referenceIdIndex: index("reference_idx").on(table.referenceId),
  })
);

//Relations
export const questionRelation = relations(question, ({ one }) => ({
  testSession: one(testSession, {
    fields: [question.referenceId],
    references: [testSession.id],
    relationName: "testSession.question",
  }),
}));


// Types
export type Question = typeof question.$inferSelect;
export type UpdateQuestion = Partial<typeof question.$inferInsert>


// Zod
export const zodUpdateQuestion = createUpdateSchema(question)