import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import betterAuthView from "./lib/auth/auth-view";
import { organizationRouter } from "./router/organization/organization.router";
import { swagger } from "@elysiajs/swagger";
import { participantRouter } from "./router/participant/participant.router";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { env } from "./lib/env";

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .use(
    opentelemetry({
      spanProcessors: [
        new BatchSpanProcessor(
          new OTLPTraceExporter({
            url: "https://api.axiom.co/v1/traces",
            headers: {
              Authorization: `Bearer ${env.AXIOM_TOKEN}`,
              "X-Axiom-Dataset": env.AXIOM_DATASET,
            },
          })
        ),
      ],
    })
  )
  .get("/", async () => {
    return "Hello World";
  })
  .all("/api/auth/*", betterAuthView) // Handle auth routes
  .use(organizationRouter)
  .use(participantRouter)
  .listen({
    port: 4000,
  });

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
