import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../lib/env";
import { S3 } from "../../lib/s3";

export async function deleteFileFromS3(key: string, isWithCdnUrl = true) {
  if (isWithCdnUrl) {
    key = key.replace(env.CLOUDFLARE_CDN_URL, "");
  }
  await S3.send(new DeleteObjectCommand({
    Bucket: env.CLOUDFLARE_BUCKET_NAME,
    Key: key,
  }));
}
