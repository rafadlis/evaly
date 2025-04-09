import { s3 } from "../../lib/s3";
import { env } from "../../lib/env";

export async function uploadFileToS3(file: File, key: string) {
  await s3.file(key).write(file);
  return `${env.AWS_CDN_URL}/${key}`;
}