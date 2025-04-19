import { env } from "@/lib/env";

export async function uploadFileToS3(file: File, key: string) {
  // Convert File to Uint8Array to avoid "Unable to calculate hash for flowing readable stream" error
  // const arrayBuffer = await file.arrayBuffer();
  // const uint8Array = new Uint8Array(arrayBuffer);
  
  // const res = await S3.send(
  //   new PutObjectCommand({
  //     Bucket: env.CLOUDFLARE_BUCKET_NAME,
  //     Key: key,
  //     Body: uint8Array,
  //     ContentType: file.type, // Preserve the file's content type
  //   })
  // );

  // if (res.$metadata.httpStatusCode !== 200) {
  //   throw new Error("Failed to upload file to S3");
  // }

  return `${env.CLOUDFLARE_CDN_URL}/${key}`;
}
