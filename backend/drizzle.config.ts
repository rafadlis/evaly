import "dotenv/config";

import { defineConfig } from "drizzle-kit";
import { env } from "./src/lib/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema",
  dbCredentials: {
    url:
      env.ENVIRONMENT === "development"
        ? env.DATABASE_URL_DEVELOPMENT
        : env.ENVIRONMENT === "staging"
        ? env.DATABASE_URL_STAGING
        : env.DATABASE_URL_PROD,
  },
  verbose: true,
  strict: true,
});
