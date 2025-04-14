import { organizationRouter } from "./router/organization";
import { publicProcedure, router } from "./";

export const appRouter = router({
    hello: publicProcedure.query(() => {
        return new Date().toISOString()
    }),
    organization: organizationRouter
});

export type AppRouter = typeof appRouter;