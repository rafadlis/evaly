import Elysia, { t } from "elysia";
import { participantMiddleware } from "../../middlewares/auth.middleware";
import { getTestById } from "../../services/participants/test/get-test-by-id";

export const testRouter = new Elysia().group("/test", (app) => {
  return (
    app
      .derive(participantMiddleware)
      .get("/", () => {
        return "Hello World";
      })

      // Get Test By Id
      .get(
        "/:id",
        async ({ params, user, error }) => {
          try {
            const testResult = await getTestById({
              id: params.id,
              email: user?.email,
            });
            return testResult;
          } catch (errorObject) {
            return error(
              "Internal Server Error",
              (errorObject as Error).message
            );
          }
        },
        {
          params: t.Object({
            id: t.String(),
          }),
        }
      )
  );
});
