/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "evaly",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
        },
      },
    };
  },
  console: {
    autodeploy: {
      target(event) {
        if (
          event.type === "branch" &&
          event.branch === "main" &&
          event.action === "pushed"
        ) {
          return {
            stage: "production",
            runner: { engine: "codebuild", compute: "large" },
          };
        }
        if (
          event.type === "branch" &&
          event.branch === "staging" &&
          event.action === "pushed"
        ) {
          return {
            stage: "staging",
            runner: { engine: "codebuild", compute: "large" },
          };
        }
      },
    },
  },
  async run() {
    const { frontend } = await import("./infra/frontend");

    return {
      frontend: frontend.url,
    };
  },
});
