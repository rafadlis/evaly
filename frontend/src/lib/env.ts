"use client";

import { z } from "zod";

// Define the environment schema
const envSchema = z.object({
  NEXT_PUBLIC_ENVIRONMENT: z.string(),
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_API_URL: z.string(),
});

// Parse the environment variables
export const env = envSchema.parse({
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_ENVIRONMENT === "development" ? process.env.NEXT_PUBLIC_URL_DEVELOPMENT : process.env.NEXT_PUBLIC_URL_STAGING,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_ENVIRONMENT === "development" ? process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT : process.env.NEXT_PUBLIC_API_URL_STAGING,
});
