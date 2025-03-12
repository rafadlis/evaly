import { relations } from "drizzle-orm";
import { testSection } from "./test.section";
import { pgTable, varchar, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { ulid } from "ulidx";
import { user } from "./user";
import { test } from "./test";

export const testAttempt = pgTable(
  "test_attempt",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => "ta-" + ulid()),
    testSectionId: varchar("test_section_id").references(() => testSection.id),
    testId: varchar("test_id").references(() => test.id),
    participantEmail: varchar("participant_email").notNull(),
    startedAt: timestamp("started_at", {
      mode: "string",
      withTimezone: true,
    }),
    completedAt: timestamp("completed_at", {
      mode: "string",
      withTimezone: true,
    }),
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
  },
  (t) => ({
    uniqueTestSection: uniqueIndex("unique_test_section_attempt").on(
      t.testSectionId,
      t.testId,
      t.participantEmail
    ),
  })
);

export const testAttemptRelations = relations(testAttempt, ({ one }) => ({
  testSection: one(testSection, {
    fields: [testAttempt.testSectionId],
    references: [testSection.id],
    relationName: "testAttempt.testSection",
  }),
  participant: one(user, {
    fields: [testAttempt.participantEmail],
    references: [user.email],
  }),
  test: one(test, {
    fields: [testAttempt.testId],
    references: [test.id],
  }),
}));
