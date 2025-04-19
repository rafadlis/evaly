import { organizerProcedure, router } from "@/trpc";
import { testRouter } from "./test.router";
import { testSectionRouter } from "./test.section.router";
import { questionRouter } from "./question.router";
import { questionTemplateRouter } from "./question.template.router";
import { z } from "zod";
import { uploadFileToR2 } from "@/services/common/upload-file-to-r2";
import { deleteFileFromR2 } from "@/services/common/delete-file-from-r2";
import { updateProfile } from "@/services/common/update-profile";
import { ulid } from "ulidx";

export const organizationRouter = router({
  // Get current profile as organizer (e.g user, session & selectedOrganization)
  profile: organizerProcedure.query(({ ctx }) => {
    return ctx;
  }),

  updateProfile: organizerProcedure
    .input(z.instanceof(FormData))
    .mutation(async ({ input, ctx: { user } }) => {
      const imageFile = input.get("imageFile");
      const fullName = input.get("fullName") as string;

      let newImageUrl: string | undefined = undefined;

      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        try {
          const extension = imageFile.name.split(".").pop();
          const imageUrl = await uploadFileToR2(
            imageFile,
            `user/${user.id}/profile-${ulid()}.${extension}`
          );

          if (imageUrl && user.image) {
            await deleteFileFromR2(user.image, true);
            newImageUrl = imageUrl;
          }

        } catch (e) {
          console.error(e);
          throw new Error("Failed to upload image");
        }
      }
      
      console.log("Update profile", {
        id: user.id,
        name: fullName,
        image: newImageUrl,
      });

      return updateProfile({
        id: user.id,
        name: fullName,
        image: newImageUrl,
      });
    }),

  test: testRouter,
  testSection: testSectionRouter,
  question: questionRouter,
  questionTemplate: questionTemplateRouter,
});
