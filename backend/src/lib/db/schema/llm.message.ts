import { CoreMessage } from "ai";
import { jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { ulid } from "ulidx";

export const llmMessage = pgTable("llm_message", {
  id: varchar("id", { length: 100 })
    .$defaultFn(() => `msg_${ulid()}`)
    .primaryKey(),
  message: jsonb("message").$type<CoreMessage>(),
  referenceId: varchar("reference_id", { length: 255 }).notNull(),
  organizationId: varchar("organization_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
