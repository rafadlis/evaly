import { env } from "../env";
import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const db = drizzle(neon(env.DATABASE_URL), { schema });
export default db;
