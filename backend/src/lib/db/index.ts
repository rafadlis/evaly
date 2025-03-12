import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";
import { Resource } from "sst";

const dbRes = Resource.EvalyDB;
const dbUrl = `postgres://${dbRes.username}:${dbRes.password}@${dbRes.host}:${dbRes.port}/${dbRes.database}`;

const db = drizzle(dbUrl, { schema });

export default db;
