import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";
import { env } from "../env";

let dbUrl: string;

if (env.ENVIRONMENT === "development") {
  dbUrl = env.DATABASE_URL_DEVELOPMENT;
} else if (env.ENVIRONMENT === "staging") {
  dbUrl = env.DATABASE_URL_STAGING;
} else {
  dbUrl = env.DATABASE_URL_PROD;
}

const db = drizzle(dbUrl, { schema });

export default db;
