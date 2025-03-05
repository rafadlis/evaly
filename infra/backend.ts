import { backendSecrets } from "./secrets";

export const vpc = new sst.aws.Vpc("EvalyBackendVPC",{
});

export const cluster = new sst.aws.Cluster("EvalyBackendCluster", {
  vpc,
  forceUpgrade: "v2",
});

cluster.addService("EvalyBackendService", {
  public: {
    ports: [
      { listen: "4000/http" },
      { listen: "443/https", forward: "4000/http" },
    ],
    domain: {
      name:
        $app.stage === "production"
          ? "api.evaly.io"
          : $app.stage === "staging"
            ? "api-staging.evaly.io"
            : "localhost",
      dns: sst.aws.dns(),
    },
  },
  image: {
    context: ".",
    dockerfile: "backend/Dockerfile",
  },
  dev: {
    command: "bun --filter @evaly/backend dev",
  },
  architecture: "arm64",
  cpu: $app.stage === "production" ? "1 vCPU" : "0.25 vCPU",
  memory: $app.stage === "production" ? "2 GB" : "0.5 GB",
  scaling: {
    min: 1,
    max: $app.stage === "production" ? 10 : 1,
    memoryUtilization: 50,
    cpuUtilization: 50,
  },
  environment: backendSecrets,
});
