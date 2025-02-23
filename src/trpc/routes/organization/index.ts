import { organizerProcedure, router } from "../../trpc";
import { questionRouter } from "./question";
import { sessionRouter } from "./session";
import { testRouter } from "./test";

export const organizationRouter = router({
  // Get current profile as organizer (e.g user, session & selectedOrganization)
  profile: organizerProcedure.query(({ ctx }) => {
    return ctx;
  }),
  
  tests: testRouter,
  session: sessionRouter,
  question: questionRouter
});
