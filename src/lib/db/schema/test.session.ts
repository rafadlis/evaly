import { relations, sql } from "drizzle-orm";
import { smallint, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { ulid } from "ulidx";
import { question } from "./question";

export const testSession = pgTable("test-session", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => "ss-" + ulid()),
  title: varchar("title", { length: 255 }),
  duration: smallint("duration").default(0),
  order: smallint("order"),
  testId: varchar("test_id", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }),
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
});

//Relations
export const testSessionRelation = relations(testSession, ({ many }) => ({
  question: many(question, { relationName: "testSession.question" }),
}));
