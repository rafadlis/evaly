import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { account, session, user, verification } from "../db/schema";
import db from "../db";
import { env } from "../env";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET!,
  // plugins: [
  //   magicLink({
  //     sendMagicLink({ email, token, url }, request) {},
  //   }),
  // ],
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
      redirectURI:
        env.ENVIRONMENT === "development"
          ? "http://localhost:4000/api/auth/callback/google"
          : env.ENVIRONMENT === "staging"
          ? "https://api-staging.evaly.io/api/auth/callback/google"
          : "https://evaly.io/api/auth/callback/google",
    },
  },
  trustedOrigins: [env.WEB_PUBLIC_URL!],

  advanced:
    env.ENVIRONMENT === "development"
      ? undefined
      : {
          useSecureCookies: true,
          crossSubDomainCookies: {
            enabled: true,
            domain: ".evaly.io",
          },
          defaultCookieAttributes: {
            secure: true,
            httpOnly: true,
            sameSite: "none",
            partitioned: true,
          },
        },
});
