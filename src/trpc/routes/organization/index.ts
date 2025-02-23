import { organizerProcedure, router } from "../../trpc";
import { testRouter } from "./test";

export const organizationRouter = router({
  // Get current profile as organizer (e.g user, session & selectedOrganization)
  profile: organizerProcedure.query(({ ctx }) => {
    return ctx;
  }),
  
  tests: testRouter
});
