import { z } from "zod";

// Define environment-specific variable names
const ENV_VARS = {
  WEB_PUBLIC_URL: "WEB_PUBLIC_URL",
  BETTER_AUTH_SECRET: "BETTER_AUTH_SECRET",
  DATABASE_URL: "DATABASE_URL",
} as const;

// Define supported environments
const ENVIRONMENTS = ["development", "staging"] as const;
type Environment = typeof ENVIRONMENTS[number];

// Define common environment variables schema
const commonSchema = {
  ENVIRONMENT: z.enum(ENVIRONMENTS),
  AXIOM_TOKEN: z.string(),
  AXIOM_DATASET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
};

// Create a schema builder for environment-specific variables
function createEnvSpecificSchema(environment: Environment) {
  return Object.fromEntries(
    Object.values(ENV_VARS).map(varName => [
      `${varName}_${environment.toUpperCase()}`,
      z.string()
    ])
  );
}

// Build the complete schema with all environment variables
const envSchema = z.object({
  ...commonSchema,
  ...createEnvSpecificSchema("development"),
  ...createEnvSpecificSchema("staging"),
});

// Parse and validate environment variables
const rawEnv = envSchema.parse(process.env);

// Define the type for our environment object
type EnvType = {
  ENVIRONMENT: Environment;
  AXIOM_TOKEN: string;
  AXIOM_DATASET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  WEB_PUBLIC_URL: string;
  BETTER_AUTH_SECRET: string;
  DATABASE_URL: string;
};

function createEnv(): EnvType {
  const environment = rawEnv.ENVIRONMENT;
  
  // Start with common variables
  const env = {
    ENVIRONMENT: environment,
    AXIOM_TOKEN: rawEnv.AXIOM_TOKEN,
    AXIOM_DATASET: rawEnv.AXIOM_DATASET,
    GOOGLE_CLIENT_ID: rawEnv.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: rawEnv.GOOGLE_CLIENT_SECRET,
  } as Partial<EnvType>;
  
  // Add environment-specific variables without the suffix
  const suffix = `_${environment.toUpperCase()}`;
  
  // Dynamically add all environment-specific variables
  Object.values(ENV_VARS).forEach(varName => {
    const fullVarName = `${varName}${suffix}` as keyof typeof rawEnv;
    (env as any)[varName] = rawEnv[fullVarName];
  });
  
  return env as EnvType;
}

// Export the environment object
export const env = createEnv();