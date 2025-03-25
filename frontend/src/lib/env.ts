"use client";

import { z } from "zod";

// Define the environment schema
const envSchema = z.object({
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_API_URL: z.string(),
});

// Parse the environment variables
export const env = envSchema.parse(process.env);
