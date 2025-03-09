import Elysia from "elysia";
import { testRouter } from "./test.router";
import { auth } from "../../lib/auth";

export const participantRouter = new Elysia().group("/participant", (app) => {
  return app
    .get("/", () => {
      return "Hello World";
    })
    .get("/profile", async ({ request }) => {
      const session = await auth.api.getSession({ headers: request.headers });
      return session;
    })
    .use(testRouter);
});
