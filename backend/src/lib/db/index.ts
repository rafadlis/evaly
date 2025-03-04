import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";

const db = drizzle(Bun.env.DATABASE_URL!, { schema });

export default db;
