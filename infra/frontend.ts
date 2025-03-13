export const environment = {
  //common
  NEXT_PUBLIC_ENVIRONMENT: $app.stage,

  //development-frontend
  NEXT_PUBLIC_URL_DEVELOPMENT: new sst.Secret("NEXT_PUBLIC_URL_DEVELOPMENT").value,
  NEXT_PUBLIC_API_URL_DEVELOPMENT: new sst.Secret("NEXT_PUBLIC_API_URL_DEVELOPMENT").value,

  //staging-frontend
  NEXT_PUBLIC_URL_STAGING: new sst.Secret("NEXT_PUBLIC_URL_STAGING").value,
  NEXT_PUBLIC_API_URL_STAGING: new sst.Secret("NEXT_PUBLIC_API_URL_STAGING").value,
};

export const frontend = new sst.aws.Nextjs("Frontend", {
  path: "frontend",
  domain: {
    name:
      $app.stage === "production"
        ? "evaly.io"
        : $app.stage === "staging"
        ? "staging.evaly.io"
        : undefined,
    redirects: $app.stage === "production" ? ["www.evaly.io"] : undefined,
    dns: sst.aws.dns(),
  },
  environment: environment,
  warm: 50
});