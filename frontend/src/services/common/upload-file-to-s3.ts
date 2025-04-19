import { env } from "@/lib/env";
import { S3 } from "@/lib/s3";
import {
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  CompletedPart,
} from "@aws-sdk/client-s3";

export async function uploadFileToR2(file: File, key: string) {
  const TEN_MB = 10 * 1024 * 1024;
  const bucketName = env.CLOUDFLARE_BUCKET_NAME;

  if (file.size <= TEN_MB) {
    // Use PutObject for files <= 10MB
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    });

    await S3.send(putObjectCommand);
  } else {
    // Use multipart upload for files > 10MB
    const createMultipartUploadCommand = new CreateMultipartUploadCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: file.type,
    });

    const { UploadId } = await S3.send(createMultipartUploadCommand);

    if (!UploadId) {
      throw new Error("Failed to create multipart upload.");
    }

    const uploadPromises: Promise<CompletedPart>[] = [];
    const partSize = 5 * 1024 * 1024; // 5MB part size (minimum allowed)
    let partNumber = 1;
    let start = 0;

    try {
      while (start < file.size) {
        const end = Math.min(start + partSize, file.size);
        const chunk = file.slice(start, end);

        const uploadPartCommand = new UploadPartCommand({
          Bucket: bucketName,
          Key: key,
          UploadId: UploadId,
          PartNumber: partNumber,
          Body: Buffer.from(await chunk.arrayBuffer()),
        });

        const uploadPromise = S3.send(uploadPartCommand).then((result) => ({
          PartNumber: partNumber,
          ETag: result.ETag,
        }));
        uploadPromises.push(uploadPromise);

        partNumber++;
        start = end;
      }

      const completedParts = await Promise.all(uploadPromises);

      const completeMultipartUploadCommand = new CompleteMultipartUploadCommand({
        Bucket: bucketName,
        Key: key,
        UploadId: UploadId,
        MultipartUpload: {
          Parts: completedParts,
        },
      });

      await S3.send(completeMultipartUploadCommand);
    } catch (error) {
      console.error("Error during multipart upload:", error);
      const abortMultipartUploadCommand = new AbortMultipartUploadCommand({
        Bucket: bucketName,
        Key: key,
        UploadId: UploadId,
      });
      await S3.send(abortMultipartUploadCommand);
      throw new Error("Multipart upload failed and was aborted.");
    }
  }

  return `${env.CLOUDFLARE_CDN_URL}/${key}`;
}
