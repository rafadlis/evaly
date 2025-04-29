import { env } from "../env";
import * as schema from "./schema";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres'

const client = postgres(env.DATABASE_URL, { prepare: false })
const db = drizzle(client, { schema, });

export default db;
