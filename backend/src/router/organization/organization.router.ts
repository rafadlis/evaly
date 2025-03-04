import Elysia from "elysia";
import { organizationMiddleware } from "../../middlewares/auth.middleware";
import { testRouter } from "./test.router";
import { questionRouter } from "./question.router";

export const organizationRouter = new Elysia().group("/organization", (app) => {
  return app
    .derive(organizationMiddleware)
    .get("/", () => {
      return "Hello World";
    })
    .get("/profile", ({ organizer, user, session }) => {
      return {
        organizer,
        user,
        session,
      };
    })
    .use(testRouter)
    .use(questionRouter)
});
