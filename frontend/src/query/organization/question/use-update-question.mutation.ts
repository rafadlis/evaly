import { $api } from "@/lib/api";
import { UpdateQuestion } from "@evaly/backend/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateQuestionMutation() {
    return  useMutation({
        mutationKey: ["update-question"],
        mutationFn: async (data: UpdateQuestion) => {
          if (!data.id) return;
          const response = await $api.organization.question
            .update({ id: data.id })
            .put(data);
          if (response.status !== 200) {
            throw new Error(response.error?.value as unknown as string);
          }
          return response.data?.updatedQuestion
        },
        onError(error) {
          toast.error(error.message);
        },
      });
}