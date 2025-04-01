import { Message } from "ai";
import { randomUUIDv7 } from "bun";
import { index, integer, jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const llmMessage = pgTable(
  "llm_message",
  {
    id: varchar("id", { length: 100 }).$default(() => `llm-${randomUUIDv7()}`).primaryKey(),
    title: varchar("title", { length: 255 }),
    messages: jsonb("messages").$type<Message[]>(),
    organizationId: varchar("organization_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    completitionTokens: integer("completition_tokens").notNull().default(0),
    promptTokens: integer("prompt_tokens").notNull().default(0),
    totalTokens: integer("total_tokens").notNull().default(0),
  },
  (t) => ({
    organizationIdIndex: index("message_organization_id_index").on(
      t.organizationId
    ),
  })
);
