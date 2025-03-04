import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import betterAuthView from "./lib/auth/auth-view";
import { organizationRouter } from "./router/organization";

const app = new Elysia()
  .use(cors())
  .all("/api/auth/*", betterAuthView) // Handle auth routes
  .get("/", async () => {
    return "Hello World";
  })
  .use(organizationRouter)
  .listen({
    port: 4000,
  });


export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
