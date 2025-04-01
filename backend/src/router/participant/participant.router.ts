import Elysia, { t } from "elysia";
import { testRouter } from "./test.router";
import { auth } from "../../lib/auth";
import { getFileExtension } from "../../lib/utils";
import { uploadFileToS3 } from "../../services/common/upload-file-to-s3";
import { participantMiddleware } from "../../middlewares/auth.middleware";
import { updateProfile } from "../../services/common/update-profile";

import { deleteFileFromS3 } from "../../services/common/delete-file-from-s3";

export const participantRouter = new Elysia().group("/participant", (app) => {
  return (
    app
      .get("/", () => {
        return "Hello World";
      })
      .get("/profile", async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers });
        return session;
      })
      // Update organizer profile
      .derive(participantMiddleware)
      .put(
        "/profile",
        async ({ body, user, error }) => {
          // Check if user is trying to update their image profile
          let newImageUrl: string | undefined = undefined;
          if (body.imageFile) {
            const extension = getFileExtension(body.imageFile.name);
            const imageUrl = await uploadFileToS3(
              body.imageFile,
              `user/${user.id}/profile-${Bun.randomUUIDv7()}.${extension}`
            );
            if (imageUrl && user.image) {
              // Delete old image from S3
              await deleteFileFromS3(user.image, true);
              newImageUrl = imageUrl;
            }
          }

          const updatedUser = await updateProfile({
            id: user.id,
            name: body.fullName,
            image: newImageUrl,
          }).catch((error) => {
            error.setCode(500);
            error.setMessage("Failed to update organizer profile");
          });

          return updatedUser;
        },
        {
          body: t.Object({
            fullName: t.Optional(t.String()),
            imageFile: t.Optional(
              t.File({ format: "image/*", maxSize: 1024 * 1024 * 5 }) // 5MB
            ),
          }),
        }
      )
      .use(testRouter)
  );
});
