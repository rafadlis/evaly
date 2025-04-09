import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../env";
import * as schema from "./schema";

const primaryDb = drizzle(
  new Pool({
    connectionString: env.DATABASE_URL,
  }),
  {
    schema,
  }
);

// const readUsEast1Db = drizzle(
//   new Pool({
//     connectionString: env.DATABASE_URL,
//   }),
//   {
//     schema,
//   }
// );

export default primaryDb;
