import Elysia, { t } from "elysia";
import { participantMiddleware } from "../../middlewares/auth.middleware";
import { getAttemptById } from "../../services/participants/attempt/get-attempt-by-id";
import { checkAttemptAccess } from "../../services/participants/attempt/check-attempt-acces";
import { postAttemptAnswer } from "../../services/participants/attempt/post-attempt-answer";
import { ValidatedInsertTestAttemptAnswer } from "../../types/test.attempt";
import { getAttemptAnswers } from "../../services/participants/attempt/get-attempt-answers";
import { getOrCreateAttempt } from "../../services/participants/attempt/get-or-create-attempt";
import { getTestById } from "../../services/participants/test/get-test-by-id";
import { submitAttempt } from "../../services/participants/attempt/submit-attempt";

export const attemptRouter = new Elysia().group("/attempt", (app) =>
  app
    .derive(participantMiddleware)

    // Start Test
    .post("/start/:testId", async ({ params, user, error }) => {
      // Check if the test is published or not return error if not published
      const test = await getTestById({
        id: params.testId,
        email: user?.email,
      });

      if (test.error) {
        return error(test.error.status, test.error.message);
      }

      // Get the list of test section
      if (!test.testSections) {
        return error(404, "Test section not found");
      }

      // Check if there is an attempt already, return the attempt
      // If there is no attempt, create a new attempt
      const attempt = await getOrCreateAttempt({
        testId: params.testId,
        testSections: test.testSections,
        email: user?.email,
      });

      // Return the attempt
      return attempt;
    })

    // Get Attempt By Id
    .get("/:id", async ({ params, user, error }) => {
      // Check if the attempt is accessible
      const check = await checkAttemptAccess(params.id, user.email);

      if (!check || !check.testId) {
        return error(404, "Attempt not found");
      }

      // Check if the test is published or not return error if not published
      const test = await getTestById({
        id: check.testId,
        email: user?.email,
      });

      if (test.error) {
        return error(test.error.status, test.error.message);
      }

      if (check.completedAt) {
        return error(403, `You have already complete this test`);
      }

      const attempt = await getAttemptById(params.id);

      return attempt;
    })

    // Submit Answer
    .post(
      "/:id/answer",
      async ({ params, body, user, error }) => {
        const check = await checkAttemptAccess(params.id, user.email);

        if (!check) {
          return error(404, "Attempt not found");
        }

        if (check.completedAt) {
          return error(
            403,
            `You have already complete this test, you can't answer any more questions`
          );
        }

        const answer = await postAttemptAnswer({
          ...body,
          attemptId: params.id,
        });

        return answer;
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: ValidatedInsertTestAttemptAnswer,
      }
    )

    // Get Attempt Answers
    .get(
      "/:id/answers",
      async ({ params, user, error }) => {
        const check = await checkAttemptAccess(params.id, user.email);

        if (!check) {
          return error(404, "Attempt not found");
        }

        const answers = await getAttemptAnswers(params.id);

        return answers;
      },
      {
        params: t.Object({
          id: t.String(),
        }),
      }
    )

    // Submit Attempt
    .post(
      "/:id/submit",
      async ({ params, user, error }) => {
        const check = await checkAttemptAccess(params.id, user.email);

        if (!check) {
          return error(404, "Attempt not found");
        }

        if (check.completedAt) {
          return error(403, `You have already complete this test`);
        }

        const submittedAttempt = await submitAttempt(params.id);

        return submittedAttempt;
      }
    )
);
