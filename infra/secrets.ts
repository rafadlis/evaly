export const backendSecrets = {
  // common
  ENVIRONMENT: $app.stage,
  GOOGLE_CLIENT_ID: new sst.Secret("GOOGLE_CLIENT_ID").value,
  GOOGLE_CLIENT_SECRET: new sst.Secret("GOOGLE_CLIENT_SECRET").value,
  AXIOM_API_TOKEN: new sst.Secret("AXIOM_API_TOKEN").value,
  AXIOM_DATASET_NAME: new sst.Secret("AXIOM_DATASET_NAME").value,

  //development
  WEB_PUBLIC_URL_DEVELOPMENT: new sst.Secret("WEB_PUBLIC_URL_DEVELOPMENT").value,
  DATABASE_URL_DEVELOPMENT: new sst.Secret("DATABASE_URL_DEVELOPMENT").value,
  BETTER_AUTH_SECRET_DEVELOPMENT: new sst.Secret("BETTER_AUTH_SECRET_DEVELOPMENT").value,
 
  //staging
  WEB_PUBLIC_URL_STAGING: new sst.Secret("WEB_PUBLIC_URL_STAGING").value,
  DATABASE_URL_STAGING: new sst.Secret("DATABASE_URL_STAGING").value,
  BETTER_AUTH_SECRET_STAGING: new sst.Secret("BETTER_AUTH_SECRET_STAGING").value,
};

export const frontendSecrets = {
  //common
  NEXT_PUBLIC_ENVIRONMENT: $app.stage,

  //development
  NEXT_PUBLIC_URL_DEVELOPMENT: new sst.Secret("NEXT_PUBLIC_URL_DEVELOPMENT").value,
  NEXT_PUBLIC_API_URL_DEVELOPMENT: new sst.Secret("NEXT_PUBLIC_API_URL_DEVELOPMENT").value,

  //staging
  NEXT_PUBLIC_URL_STAGING: new sst.Secret("NEXT_PUBLIC_URL_STAGING").value,
  NEXT_PUBLIC_API_URL_STAGING: new sst.Secret("NEXT_PUBLIC_API_URL_STAGING").value,
};
