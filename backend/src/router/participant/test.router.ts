import Elysia, { t } from "elysia";
import { participantMiddleware } from "../../middlewares/auth.middleware";
import { getTestById } from "../../services/participants/test/get-test-by-id";
import { getOrCreateAttempt } from "../../services/participants/attempt/get-or-create-attempt";

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

          return testResult;
        },
        {
          params: t.Object({
            id: t.String(),
          }),
        }
      )

      // Start Test
      .post("/:id/start", async ({ params, user, error }) => {
        // Check if the test is published or not return error if not published
        const test = await getTestById({ id: params.id, email: user?.email });

        if (test.error) {
          return error(test.error.status, test.error.message);
        }

        // Get the list of test session
        if (!test.testSessions) {
          return error(404, "Test session not found");
        }

        // Check if there is an attempt already, return the attempt
        // If there is no attempt, create a new attempt
        const attempt = await getOrCreateAttempt({
          testId: params.id,
          testSessions: test.testSessions,
          email: user?.email,
        });

        // Return the attempt
        return attempt
      })
  );
});
