import {
  jsonb,
  pgTable,
  timestamp,
  varchar,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

import { question } from "./question";

export const questionTemplate = pgTable(
  "question_template",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "qst-tpl-" + Bun.randomUUIDv7()),
    title: varchar("title", { length: 255 }),
    organizationId: varchar("organization_id", { length: 255 }).notNull(),
    organizerId: varchar("organizer_id", { length: 255 }).notNull(),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    isAiGenerated: boolean("is_ai_generated").notNull().default(false),
    isGenerating: boolean("is_generating").notNull().default(false),
    isGeneratingExpiredAt: timestamp("is_generating_expired_at", {
      mode: "string",
      withTimezone: true,
    }),
    aiContents: jsonb("ai_contents")
      .$type<
        {
          prompt: string;
          questions?: {
            options: {
              id: string;
              isCorrect: boolean;
              text: string;
            }[];
            order: number,
            type: "multiple-choice" | "yes-or-no" | "text-field";
            question: string;
          }[];
          context: "educational" | "quiz" | "hr";
          usage?: {
            completionTokens: number;
            promptTokens: number;
            totalTokens: number;
          };
        }[]
      >()
      .default([]),
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
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
    deletedAt: timestamp("deleted_at", {
      mode: "string",
      withTimezone: true,
    }),
  },
  (t) => ({
    organizationIdIdx: index("question_template_organization_id_idx").on(
      t.organizationId
    ),
    organizerIdIdx: index("question_template_organizer_id_idx").on(
      t.organizerId
    ),
  })
);

export const questionTemplateRelations = relations(
  questionTemplate,
  ({ many }) => ({
    questions: many(question),
  })
);
