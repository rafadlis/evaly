import { getCloudflareContext } from "@opennextjs/cloudflare";
import { env } from "../env";
import * as schema from "./schema";
import { drizzle } from 'drizzle-orm/node-postgres';

const connectionString =
  env.NEXTJS_ENV === "production" && process.env.NODE_ENV === "production"
    ? getCloudflareContext().env.PRODUCTION_DB.connectionString
    : env.DATABASE_URL;

const db = drizzle(connectionString, { schema });

export default db;
