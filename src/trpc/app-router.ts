import { organizerRouter } from "./routes/organizer";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
    hello: publicProcedure.query(() => {
        return new Date().toISOString()
    }),
    organizer: organizerRouter
});

export type AppRouter = typeof appRouter;