import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const llmMessage = pgTable("llm_message", {
  id: varchar("id", { length: 255 }).primaryKey(),
  referenceId: varchar("reference_id", { length: 255 }).notNull(),
  message: text("message"),
  type: varchar("type", { length: 20, enum: ["user", "assistant"] }).notNull(),
  organizationId: varchar("organization_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
});
