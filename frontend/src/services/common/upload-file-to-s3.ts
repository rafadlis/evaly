import { env } from "@/lib/env";
import { S3 } from "@/lib/s3";
import {
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Helper function to create XML body for CompleteMultipartUpload
// function createCompleteMultipartUploadBody(parts: CompletedPart[]): string {
//   let xml = '<CompleteMultipartUpload>\n';
//   parts.forEach(part => {
//     xml += `  <Part>\n`;
//     xml += `    <PartNumber>${part.PartNumber}</PartNumber>\n`;
//     xml += `    <ETag>${part.ETag}</ETag>\n`; // Ensure ETag includes quotes if needed by S3
//     xml += `  </Part>\n`;
//   });
//   xml += '</CompleteMultipartUpload>';
//   return xml;
// }

export async function uploadFileToR2(file: File, key: string) {
  const TEN_MB = 10 * 1024 * 1024;
  const bucketName = env.CLOUDFLARE_BUCKET_NAME;
  const expiresIn = 3600; // Presigned URL expiry time in seconds (e.g., 1 hour)

  if (file.size <= TEN_MB) {
    // 1. Get presigned URL for PutObject
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: file.type, // ContentType is often needed for presigned PUT
      // ContentLength: file.size, // Might be required by R2/S3 for presigned PUTs
    });
    const signedUrl = await getSignedUrl(S3, putObjectCommand, { expiresIn });
    console.log("signedUrl", signedUrl);
    // // 2. Upload the file using fetch
    // const response = await fetch(signedUrl, {
    //   method: "PUT",
    //   body: file,
    //   headers: {
    //     'Content-Type': file.type, // Send Content-Type header
    //    // 'Content-Length': file.size.toString() // Send Content-Length if needed
    //   },
    // });

    // if (!response.ok) {
    //   throw new Error(`Failed to upload file: ${response.statusText}`);
    // }

  } else {
    // --- Multipart Upload using Presigned URLs ---
    // let uploadId: string | undefined;
    // try {
    //   // 1. Initiate Multipart Upload
    //   const createCommand = new CreateMultipartUploadCommand({
    //     Bucket: bucketName,
    //     Key: key,
    //     ContentType: file.type,
    //   });
    //   const createSignedUrl = await getSignedUrl(S3, createCommand, { expiresIn });

    //   const createResponse = await fetch(createSignedUrl, { method: "POST" });
    //   if (!createResponse.ok) {
    //     throw new Error(`Failed to initiate multipart upload: ${createResponse.statusText}`);
    //   }
    //   const createResponseBody = await createResponse.text();
    //   // Basic XML parsing to find UploadId (robust parsing recommended for production)
    //   const uploadIdMatch = createResponseBody.match(/<UploadId>(.*?)<\/UploadId>/);
    //   uploadId = uploadIdMatch ? uploadIdMatch[1] : undefined;

    //   if (!uploadId) {
    //     throw new Error("Could not get UploadId from initiation response.");
    //   }

    //   // 2. Upload Parts
    //   const partSize = 5 * 1024 * 1024; // 5MB part size
    //   const completedParts: CompletedPart[] = [];
    //   let partNumber = 1;
    //   let start = 0;

    //   while (start < file.size) {
    //     const end = Math.min(start + partSize, file.size);
    //     const chunk = file.slice(start, end);

    //     const partCommand = new UploadPartCommand({
    //       Bucket: bucketName,
    //       Key: key,
    //       UploadId: uploadId,
    //       PartNumber: partNumber,
    //       // Body is not sent here, ContentLength might be needed for signing
    //      // ContentLength: chunk.size,
    //     });
    //     const partSignedUrl = await getSignedUrl(S3, partCommand, { expiresIn });

    //     const partResponse = await fetch(partSignedUrl, {
    //       method: "PUT",
    //       body: chunk,
    //      // headers: { 'Content-Length': chunk.size.toString() } // Send Content-Length if needed
    //     });

    //     if (!partResponse.ok) {
    //       throw new Error(`Failed to upload part ${partNumber}: ${partResponse.statusText}`);
    //     }

    //     const etag = partResponse.headers.get("ETag");
    //     if (!etag) {
    //       throw new Error(`Could not get ETag for part ${partNumber}.`);
    //     }

    //     completedParts.push({ PartNumber: partNumber, ETag: etag });

    //     partNumber++;
    //     start = end;
    //   }

    //   // 3. Complete Multipart Upload
    //   const completeCommand = new CompleteMultipartUploadCommand({
    //     Bucket: bucketName,
    //     Key: key,
    //     UploadId: uploadId,
    //     // MultipartUpload body is not sent here, it's sent via fetch
    //   });
    //   const completeSignedUrl = await getSignedUrl(S3, completeCommand, { expiresIn });

    //   const completeBody = createCompleteMultipartUploadBody(completedParts);
    //   const completeResponse = await fetch(completeSignedUrl, {
    //     method: "POST",
    //     body: completeBody,
    //     headers: { 'Content-Type': 'application/xml' }
    //   });

    //   if (!completeResponse.ok) {
    //     throw new Error(`Failed to complete multipart upload: ${completeResponse.statusText}`);
    //   }

    // } catch (error) {
    //   console.error("Error during multipart upload:", error);

    //   // 4. Abort Multipart Upload on error (if uploadId was obtained)
    //   if (uploadId) {
    //     try {
    //       const abortCommand = new AbortMultipartUploadCommand({
    //         Bucket: bucketName,
    //         Key: key,
    //         UploadId: uploadId,
    //       });
    //       const abortSignedUrl = await getSignedUrl(S3, abortCommand, { expiresIn });
    //       await fetch(abortSignedUrl, { method: "DELETE" });
    //       console.log("Multipart upload aborted successfully.");
    //     } catch (abortError) {
    //       console.error("Failed to abort multipart upload:", abortError);
    //     }
    //   }
    //   // Re-throw the original error
    //   throw new Error(`Multipart upload failed: ${error instanceof Error ? error.message : String(error)}`);
    // }
  }

  // Return the final URL (assuming successful upload)
  return `${env.CLOUDFLARE_CDN_URL}/${key}`;
}
