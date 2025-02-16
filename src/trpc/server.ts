import { publicProcedure, router } from "./trpc";

export const appRouter = router({
    hello: publicProcedure.query(() => {
        return new Date().toISOString()
    }),
});

export type AppRouter = typeof appRouter;