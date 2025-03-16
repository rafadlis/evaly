import * as React from "react";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { account, session, user, verification } from "../db/schema";
import db from "../db";
import { env } from "../env";
import { emailOTP } from "better-auth/plugins";
import { mailTransporter } from "../mail-transporter";
import EmailLoginOTPEmail from "../../emails/email-login-otp";
import { renderToStaticMarkup } from "react-dom/server";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET!,
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }, request) {
        await mailTransporter.sendMail({
          from: "noreply@tetsu.app",
          to: email,
          subject: "Tetsu Login Verification",
          html: renderToStaticMarkup(<EmailLoginOTPEmail otp={otp} />),
        });
      },
    }),
  ],
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
            ? "https://api-staging.tetsu.app/api/auth/callback/google"
            : "https://tetsu.app/api/auth/callback/google",
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
            domain: ".tetsu.app",
          },
          defaultCookieAttributes: {
            secure: true,
            httpOnly: true,
            sameSite: "none",
            partitioned: true,
          },
        },
});
