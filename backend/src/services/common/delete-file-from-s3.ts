import { env } from "../../lib/env";
import { s3 } from "../../lib/s3";

export async function deleteFileFromS3(key: string, isWithCdnUrl = true) {
  if (isWithCdnUrl) {
    key = key.replace(env.AWS_CDN_URL, "");
  }
  await s3.file(key).delete();
}
