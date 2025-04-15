import { organizerProcedure, router } from "@/trpc";
import { testRouter } from "./test.router";
import { testSectionRouter } from "./test.section.router";
import { questionRouter } from "./question.router";
export const organizationRouter = router({
  // Get current profile as organizer (e.g user, session & selectedOrganization)
  profile: organizerProcedure.query(({ ctx }) => {
    return ctx;
  }),

  test: testRouter,
  testSection: testSectionRouter,
  question: questionRouter,
});