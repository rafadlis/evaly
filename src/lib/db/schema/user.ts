import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  index,
  foreignKey,
  text,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { organizer } from "./organization";

export const user = pgTable(
  "user",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: varchar("image", { length: 255 }),
    createdAt: timestamp("created_at", {
      mode:"string",
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode:"string",
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
     .$onUpdate(() => new Date().toISOString()),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
  })
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  organizer: many(organizer)
}));

export const session = pgTable(
  "session",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    ipAddress: varchar("ip_address", { length: 255 }),
    userAgent: varchar("user_agent", { length: 255 }),
    createdAt: timestamp("created_at", {
      mode:"string",
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode:"string",
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
     .$onUpdate(() => new Date().toISOString()),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "session_user_fk",
    }).onDelete("cascade"),
  })
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const account = pgTable(
  "account",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    accountId: varchar("account_id", { length: 255 }).notNull(),
    providerId: varchar("provider_id", { length: 255 }).notNull(),
    accessToken: varchar("access_token", { length: 255 }),
    refreshToken: varchar("refresh_token", { length: 255 }),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: varchar("scope", { length: 255 }),
    idToken: text("id_token"),
    password: varchar("password", { length: 255 }),
    createdAt: timestamp("created_at", {
      mode:"string",
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode:"string",
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
     .$onUpdate(() => new Date().toISOString()),
  },
  (table) => ({
    userIdIdx: index("user_account_id_idx").on(table.userId),
    providerIdx: index("provider_idx").on(table.providerId),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "account_user_fk",
    }).onDelete("cascade"),
  })
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const verification = pgTable(
  "verification",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    value: varchar("value", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at", {
      mode:"string",
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode:"string",
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
     .$onUpdate(() => new Date().toISOString()),
  },
  (table) => ({
    identifierIdx: index("identifier_idx").on(table.identifier),
  })
);
