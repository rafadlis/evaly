import { relations } from "drizzle-orm";
import { testSession } from "./test.session";
import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { ulid } from "ulidx";
import { testSessionParticipant } from "./test.session.participant";

export const testAttempt = pgTable("test_attempt", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => "ta" + ulid()),
  testSessionId: varchar("test_session_id").references(() => testSession.id),
  participantId: varchar("participant_id").notNull(),
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
});

export const testAttemptRelations = relations(testAttempt, ({ one }) => ({
  testSession: one(testSession, {
    fields: [testAttempt.testSessionId],
    references: [testSession.id],
  }),
  participant: one(testSessionParticipant, {
    fields: [testAttempt.participantId],
    references: [testSessionParticipant.id],
  }),
}));
