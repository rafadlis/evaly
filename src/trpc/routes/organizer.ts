import { organizerProcedure, router } from "../trpc";

export const organizerRouter = router({
  profile: organizerProcedure.query(({ ctx }) => {
    return ctx;
  }),
});
