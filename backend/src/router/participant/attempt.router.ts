import Elysia, { t } from "elysia";
import { participantMiddleware } from "../../middlewares/auth.middleware";
import { getAttemptById } from "../../services/participants/attempt/get-attempt-by-id";
import { checkAttemptAccess } from "../../services/participants/attempt/check-attempt-acces";
import { postAttemptAnswer } from "../../services/participants/attempt/post-attempt-answer";
import { ValidatedInsertTestAttemptAnswer } from "../../types/test.attempt";
import { getAttemptAnswers } from "../../services/participants/attempt/get-attempt-answers";

export const attemptRouter = new Elysia().group("/attempt", (app) =>
  app
    .derive(participantMiddleware)
    .get(
      "/:id",
      async ({ params, user, error }) => {
        const check = await checkAttemptAccess(params.id, user.email);

        if (!check) {
          return error(404, "Attempt not found");
        }

        if (check.completedAt) {
          return error(403, `You have already complete this test`);
        }

        const attempt = await getAttemptById(params.id);

        return attempt;
      },
      {
        params: t.Object({
          id: t.String(),
        }),
      }
    )
    .post(
      "/:id/answer",
      async ({ params, body, user, error }) => {
        const check = await checkAttemptAccess(params.id, user.email);

        if (!check) {
          return error(404, "Attempt not found");
        }

        if (check.completedAt) {
          return error(403, `You have already complete this test, you can't answer any more questions`);
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
);
