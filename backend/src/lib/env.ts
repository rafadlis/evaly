import { z } from "zod";

const envSchema = z.object({
  ENVIRONMENT: z.enum(["development", "staging", "production"]),

  WEB_PUBLIC_URL: z.string(),

  BETTER_AUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  DATABASE_URL_DEVELOPMENT: z.string(),
  DATABASE_URL_STAGING: z.string(),
  DATABASE_URL_PROD: z.string(),

  AXIOM_API_TOKEN: z.string(),
  AXIOM_DATASET_NAME: z.string(),
});

export const env = envSchema.parse(process.env);
