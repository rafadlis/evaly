import { env } from "@/lib/env";
import { S3 } from "@/lib/s3";
import {
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function uploadFileToR2(file: File, key: string) {
  console.log(
    await getSignedUrl(
      S3,
      new PutObjectCommand({ Bucket: "my-bucket-name", Key: "dog.png" }),
      { expiresIn: 3600 },
    ),
  );
  // Return the final URL (assuming successful upload)
  return `${env.CLOUDFLARE_CDN_URL}/${key}`;
}
