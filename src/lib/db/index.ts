import { env } from "../env";
import * as schema from "./schema";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true

const db = drizzle(neon(env.DATABASE_URL), { schema });
export default db;
