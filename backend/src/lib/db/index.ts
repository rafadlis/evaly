import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";
import { env } from "../env";

const db = drizzle(env.DATABASE_URL, { schema });

export default db;
