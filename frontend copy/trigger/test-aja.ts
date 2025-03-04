import { logger, task, wait } from "@trigger.dev/sdk/v3";

export const testAjaTask = task({
  id: "test-aja",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 10, // Stop executing after 300 secs (5 mins) of compute
  handleError(payload, error, params) {
    logger.error("Error in testAjaTask", { payload, error, params });
  },
  run: async (payload: unknown, { ctx }) => {
    logger.log("Hello, world!", { payload, ctx });

    await wait.for({ seconds: 15 });

    return {
      message: "Hello, world!",
    }
  },
});