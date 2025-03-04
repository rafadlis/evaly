/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
      return {
        name: "evaly",
        removal: input?.stage === "production" ? "retain" : "remove",
        home: "aws",
        providers: {
          aws: {
            region: "ap-southeast-1",
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
              runner: { engine: "codebuild", compute: "xlarge" },
            };
          }
          if (
            event.type === "branch" &&
            event.branch === "staging" &&
            event.action === "pushed"
          ) {
            return {
              stage: "stagings",
              runner: { engine: "codebuild", compute: "large" },
            };
          }
        },
      },
    },
    async run() {
      const infra = await import("./infra");
  
      return {
        frontend: infra.frontend.url,
      };
    },
  });