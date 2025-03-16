import { createAuthClient } from "better-auth/react";
import { env } from "./env";
import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins";
import { AuthType } from "@evaly/backend/types/auth";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  plugins: [inferAdditionalFields<AuthType>(), emailOTPClient()],
});
