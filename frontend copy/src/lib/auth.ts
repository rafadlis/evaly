import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db";
import * as schema from "./db/schema";
 
export const auth = betterAuth({
    database: drizzleAdapter(db,{
        provider: "pg",
        schema: schema
    }),
    emailAndPassword:{ 
        enabled: true,
    },
    logger: {
        level: "debug",
        log(level, message, ...args) {
            console.log(level, message, ...args);
        },
    },
    advanced:{
        cookiePrefix: "evaly",
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            enabled: true,
        },
    }
})