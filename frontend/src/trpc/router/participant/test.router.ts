import { getAllAttemptByTestId } from "@/services/participants/attempt/get-all-attempt-by-test-id";
import { getTestById } from "@/services/participants/test/get-test-by-id";
import { router } from "@/trpc";

import { participantProcedure } from "@/trpc";
import { z } from "zod";

export const testRouter = router({
  getTestById: participantProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const test = await getTestById({ id: input });
      const attempt = await getAllAttemptByTestId(input, ctx.user?.email);

      return {
        ...test,
        attempt,
      };
    }),
});
