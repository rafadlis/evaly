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

export const question = pgTable(
  "question",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "qst-" + ulid()),
    question: text("question"),
    referenceId: varchar("reference_id", { length: 255 }).notNull(),
    order: smallint("order"),
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
