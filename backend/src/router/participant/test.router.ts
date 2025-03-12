import Elysia, { t } from "elysia";
import { participantMiddleware } from "../../middlewares/auth.middleware";
import { getTestById } from "../../services/participants/test/get-test-by-id";
import { attemptRouter } from "./attempt.router";
import { getAllAttemptByTestId } from "../../services/participants/attempt/get-all-attempt-by-test-id";

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
          const testResult = await getTestById({
            id: params.id,
            email: user?.email,
          });

          if (testResult.error) {
            return error(testResult.error.status, testResult.error.message);
          }

          const attempt = await getAllAttemptByTestId(params.id);

          return {
            ...testResult,
            attempt,
          };
        },
        {
          params: t.Object({
            id: t.String(),
          }),
        }
      )

      // Attempt Router
      .use(attemptRouter)
  );
});
