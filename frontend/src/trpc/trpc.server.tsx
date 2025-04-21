import "server-only"; // <-- ensure this file cannot be imported from the client
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./app-router";
import { createCallerFactory } from "./index";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Session, User } from "better-auth";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);

const caller = createCallerFactory(appRouter)(async () => {
  const sessionRes = await auth.api.getSession({
    headers: await headers(),
  });


  const session: Session | undefined = sessionRes?.session;
  const user: User | undefined = sessionRes?.user;
  return {
    session: session,
    user: user,
  };
});
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);
