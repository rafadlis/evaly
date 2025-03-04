import { frontendSecrets } from "./secrets";

export const frontend = new sst.aws.Nextjs("Frontend", {
  path: "frontend",
  domain: {
    name:
      $app.stage === "production"
        ? "evaly.io"
        : $app.stage === "stagings"
        ? "staging.evaly.io"
        : undefined,
    redirects: $app.stage === "production" ? ["www.evaly.io"] : undefined,
    dns: sst.aws.dns(),
  },
  environment: frontendSecrets,
  warm: 1,
});
