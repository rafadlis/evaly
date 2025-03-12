import { z } from "zod";

const envSchema = z.object({
  ENVIRONMENT: z.enum(["development", "staging", "production"]),

  AXIOM_TOKEN: z.string(),
  AXIOM_DATASET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  //development-backend
  WEB_PUBLIC_URL_DEVELOPMENT: z.string(),
  BETTER_AUTH_SECRET_DEVELOPMENT: z.string(),

  //staging-backend
  WEB_PUBLIC_URL_STAGING: z.string(),
  BETTER_AUTH_SECRET_STAGING: z.string(),
});

const envAllStage = envSchema.parse(process.env);

export const env =
  envAllStage.ENVIRONMENT === "development"
    ? {
        ...envAllStage,
        WEB_PUBLIC_URL: envAllStage.WEB_PUBLIC_URL_DEVELOPMENT,
        BETTER_AUTH_SECRET: envAllStage.BETTER_AUTH_SECRET_DEVELOPMENT,
      }
    : {
        ...envAllStage,
        WEB_PUBLIC_URL: envAllStage.WEB_PUBLIC_URL_STAGING,
        BETTER_AUTH_SECRET: envAllStage.BETTER_AUTH_SECRET_STAGING,
      };
