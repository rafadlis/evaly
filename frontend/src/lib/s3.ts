import { env } from "./env";
import { S3Client } from "@aws-sdk/client-s3";

// Explicitly disable the default credential provider chain
const credentialProvider = () => async () => {
    // This provider intentionally does nothing, forcing the SDK
    // to rely solely on the explicitly provided credentials.
    throw new Error("Default credential provider explicitly disabled. Ensure credentials are provided directly.");
};

export const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
  credentialDefaultProvider: credentialProvider
});
