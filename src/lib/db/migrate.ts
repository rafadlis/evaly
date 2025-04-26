// src/migrate.ts

import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../env";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = neon(env.DATABASE_URL.replace("-pooler", ""));
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migration completed");
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
};

main();
