import { Organizer } from "@/lib/db/schema/organization";
import { getOrganizerByUserId } from "@/services/organizer/get-organizer-byuserid";
import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Session, User } from "better-auth/types";

export const createContext = async ({ req }: FetchCreateContextFnOptions) => {
  const sessionRes = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/auth/get-session`,
    {
      headers: req.headers,
    }
  );

  const sessionResJson = await sessionRes.json();
  const session: Session | undefined = sessionResJson?.session;
  const user: User | undefined = sessionResJson?.user;

  let organizer: Organizer | undefined

  if (user?.id){
    const organizerData = await getOrganizerByUserId(user.id)

    organizer = organizerData
  }

  return { session, user, organizer };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create();

export const {createCallerFactory,} = t
export const router = t.router;
export const publicProcedure = t.procedure;

export const organizerProcedure = publicProcedure.use(async (opts) => {
  const { ctx } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      organizer: ctx.organizer,
      user: ctx.user,
      session: ctx.session
    },
  });
});
