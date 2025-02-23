import { Organizer } from "@/lib/db/schema/organization";
import { getSession } from "@/services/common/get-session";
import { getSelectedOrganizerByUserId } from "@/services/organization/organizer/get-selected-organizer-byuserid";
import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Session, User } from "better-auth/types";

export const createContext = async ({ req }: FetchCreateContextFnOptions) => {
  const sessionRes = await getSession(req.headers);

  const session: Session | undefined = sessionRes?.session;
  const user: User | undefined = sessionRes?.user;

  let organizer: Organizer | undefined;

  if (user?.id) {
    const organizerData = await getSelectedOrganizerByUserId(user.id);

    organizer = organizerData;
  }

  return { session, user, organizer };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create();

export const createCallerFactory = t.createCallerFactory;
export const router = t.router;
export const publicProcedure = t.procedure;

export const organizerProcedure = publicProcedure.use(async (opts) => {
  const { ctx } = opts;

  if (!ctx.user || !ctx.session || !ctx.organizer) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      organizer: ctx.organizer,
      user: ctx.user,
      session: ctx.session,
    },
  });
});
