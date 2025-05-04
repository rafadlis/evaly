// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "evaly",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("MainWebsite", {
      regions: ["us-east-1", "ap-southeast-1"],
      domain: {
        name: $app.stage === "production" ? "evaly.io" : "staging.evaly.io",
        dns: sst.cloudflare.dns(),
        redirects: $app.stage === "production" ? ["www.evaly.io"] : undefined,
      },
    });
  },
});
