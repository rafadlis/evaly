import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { ulid } from "ulidx";
import { testSession } from "./test.session";
import { relations } from "drizzle-orm";
import { testAttempt } from "./test.attempt";

export const testSessionParticipant = pgTable("test_session_participant", {
  id: varchar("id").primaryKey().$defaultFn(() => "tsp" + ulid()),
  testSessionId: varchar("test_session_id").references(() => testSession.id),
  email: varchar("email", { length: 255 }).notNull(),
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

export const testSessionParticipantRelations = relations(
  testSessionParticipant,
  ({ one, many }) => ({
    testSession: one(testSession, {
      fields: [testSessionParticipant.testSessionId],
      references: [testSession.id],
    }),
    attempt: many(testAttempt, { relationName: "testSession.attempt" }),
  })
);
