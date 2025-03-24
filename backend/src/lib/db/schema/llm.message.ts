import { Message } from "ai";
import { index, jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { ulid } from "ulidx";

export const llmMessage = pgTable(
  "llm_message",
  {
    id: varchar("id", { length: 100 }).$default(() => `llm-${ulid()}`).primaryKey(),
    messages: jsonb("messages").$type<Message[]>(),
    organizationId: varchar("organization_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    organizationIdIndex: index("message_organization_id_index").on(
      t.organizationId
    ),
  })
);
