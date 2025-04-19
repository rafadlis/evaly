import { env } from "../env";
import * as schema from "./schema";
import { Client } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const client = new Client(env.DATABASE_URL);
const db = drizzle(client, { schema });
export default db;