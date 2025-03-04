import Elysia from "elysia";
import { organizationMiddleware } from "../middlewares/auth.middleware";

export const organizationRouter = new Elysia().group("/organization", (app) => {
  return app
    .derive(organizationMiddleware)
    .get("/", () => {
      return "Hello World";
    })
    .get("/profile", ({ organization, user, session }) => {
      return {
        organization,
        user,
        session,
      };
    });
});
