import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import betterAuthView from "./lib/auth/auth-view";
import { db } from "./lib/db";

const app = new Elysia()
  .use(cors())
  .all("/api/auth/*", betterAuthView) // Handle auth routes
  .get("/", async () => {
    const result = await db.query.user.findMany()
    return {result}
  })
  .listen({
    port: 4000,
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
