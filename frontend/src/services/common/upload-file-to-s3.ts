import { S3 } from "@/lib/s3";
import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadFileToS3(file: File, key: string) {
  const res = await S3.send(
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
      Body: file,
    })
  );

  if (res.$metadata.httpStatusCode !== 200) {
    throw new Error("Failed to upload file to S3");
  }

  return `${env.CLOUDFLARE_CDN_URL}/${key}`;
}
