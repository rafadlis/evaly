import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const poolConnection = mysql.createPool(process.env.DATABASE_URL as string)

const db = drizzle(poolConnection, { schema, mode: "default" });

export default db;