export const backendSecrets = {
  ENVIRONMENT: $app.stage,

  WEB_PUBLIC_URL: new sst.Secret("WEB_PUBLIC_URL").value,
  DATABASE_URL_DEVELOPMENT: new sst.Secret("DATABASE_URL_DEVELOPMENT").value,
  DATABASE_URL_STAGING: new sst.Secret("DATABASE_URL_STAGING").value,
  DATABASE_URL_PROD: new sst.Secret("DATABASE_URL_PROD").value,

  BETTER_AUTH_SECRET: new sst.Secret("BETTER_AUTH_SECRET").value,
  GOOGLE_CLIENT_ID: new sst.Secret("GOOGLE_CLIENT_ID").value,
  GOOGLE_CLIENT_SECRET: new sst.Secret("GOOGLE_CLIENT_SECRET").value,

  AXIOM_API_TOKEN: new sst.Secret("AXIOM_API_TOKEN").value,
  AXIOM_DATASET_NAME: new sst.Secret("AXIOM_DATASET_NAME").value,
};

export const frontendSecrets = {
  NEXT_PUBLIC_URL: new sst.Secret("NEXT_PUBLIC_URL").value,
  NEXT_PUBLIC_API_URL: new sst.Secret("NEXT_PUBLIC_API_URL").value,
  NEXT_PUBLIC_ENVIRONMENT: new sst.Secret("NEXT_PUBLIC_ENVIRONMENT").value,
};
