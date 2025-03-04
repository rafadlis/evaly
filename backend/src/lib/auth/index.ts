import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { account, session, user, verification } from "../db/schema";
import db from "../db";
import { env } from "../env";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET!,
  database: drizzleAdapter(db, {
    // We're using Drizzle as our database
    provider: "pg",
    /*
     * Map your schema into a better-auth schema
     */
    schema: {
      user,
      session,
      verification,
      account,
    },
  }),
  emailAndPassword: {
    enabled: true, // If you want to use email and password auth
  },
  socialProviders: {
    /*
     * We're using Google and Github as our social provider,
     * make sure you have set your environment variables
     */
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: [env.NEXT_PUBLIC_URL!],
});
