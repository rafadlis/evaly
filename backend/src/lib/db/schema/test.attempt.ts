import { relations } from "drizzle-orm";
import { testSession } from "./test.session";
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
    testSessionId: varchar("test_session_id").references(() => testSession.id),
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
    uniqueTestSession: uniqueIndex("unique_test_session_attempt").on(
      t.testSessionId,
      t.testId,
      t.participantEmail
    ),
  })
);

export const testAttemptRelations = relations(testAttempt, ({ one }) => ({
  testSession: one(testSession, {
    fields: [testAttempt.testSessionId],
    references: [testSession.id],
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
