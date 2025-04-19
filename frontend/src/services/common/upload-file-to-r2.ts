import { env } from "@/lib/env";
import { client, R2_URL } from "@/lib/r2";

export async function uploadFileToR2(file: File, key: string) {
  console.log(
    (
      await client.sign(
        new Request(`${R2_URL}/my-bucket-name/dog.png?X-Amz-Expires=${3600}`, {
          method: "PUT",
        }),
        {
          aws: { signQuery: true },
        }
      )
    ).url.toString()
  );
  
  // Return the final URL (assuming successful upload)
  return `${env.CLOUDFLARE_CDN_URL}/${key}`;
}
