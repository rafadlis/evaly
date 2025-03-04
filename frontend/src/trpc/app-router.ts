import { organizationRouter } from "./routes/organization";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
    hello: publicProcedure.query(() => {
        return new Date().toISOString()
    }),
    organization: organizationRouter
});

export type AppRouter = typeof appRouter;