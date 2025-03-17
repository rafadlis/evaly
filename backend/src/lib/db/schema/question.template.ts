import {
  jsonb,
  pgTable,
  timestamp,
  varchar,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { ulid } from "ulidx";
import { question } from "./question";

export const questionTemplate = pgTable(
  "question_template",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "qst-tpl-" + ulid()),
    title: varchar("title", { length: 255 }),
    organizationId: varchar("organization_id", { length: 255 }).notNull(),
    organizerId: varchar("organizer_id", { length: 255 }).notNull(),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    isAiGenerated: boolean("is_ai_generated").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => ({
    organizationIdIdx: index("question_template_organization_id_idx").on(t.organizationId),
    organizerIdIdx: index("question_template_organizer_id_idx").on(t.organizerId),
  })
);

export const questionTemplateRelations = relations(questionTemplate, ({ many }) => ({
  questions: many(question),
}));
