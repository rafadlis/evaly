import { Attachment } from "ai";
import { jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { ulid } from "ulidx";

export const llmMessage = pgTable("llm_message", {
  id: varchar("id", { length: 100 })
    .$defaultFn(() => `llm_${ulid()}`)
    .primaryKey(),
  message: text("message").notNull(),
  attachments: jsonb("attachments").$type<Attachment[]>(),
  role: varchar("role", {
    length: 20,
    enum: ["system", "user", "assistant", "data", "tool"],
  }).notNull(),
  referenceId: varchar("reference_id", { length: 255 }).notNull(),
  organizationId: varchar("organization_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow().notNull(),
});
