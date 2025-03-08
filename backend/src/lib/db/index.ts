import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";
import { env } from "../env";

let dbUrl: string;

if (env.ENVIRONMENT === "development") {
  dbUrl = env.DATABASE_URL;
} else if (env.ENVIRONMENT === "staging") {
  dbUrl = env.DATABASE_URL;
} else {
  dbUrl = env.DATABASE_URL;
}

const db = drizzle(dbUrl, { schema });

export default db;
