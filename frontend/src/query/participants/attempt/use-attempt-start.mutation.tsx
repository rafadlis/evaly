import { $api } from "@/lib/api";
import { TestAttempt } from "@evaly/backend/types/test.attempt";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAttemptStartMutation = (
  onSuccess: (data: TestAttempt) => void
) => {
  return useMutation({
    mutationKey: ["start-test"],
    mutationFn: async ({
      testId,
      testSectionId,
    }: {
      testId: string;
      testSectionId: string;
    }) => {
      const res = await $api.participant.test.attempt
        .start({ testId: testId as string })
        .post({ testSectionId });

      if (res.error?.value) {
        throw new Error(res.error.value);
      }

      const data = res.data;

      if (!data) {
        throw new Error("Something went wrong");
      }

      return data;
    },
    onSuccess: (data) => {
      if (!data) {
        toast.error("Something went wrong, please try again.");
        return;
      }

      onSuccess(data);
    },
    onError(error) {
      toast.error(error.message);
    },
  });
};
