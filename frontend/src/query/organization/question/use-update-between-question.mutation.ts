import { $api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useUpdateBetweenQuestionMutation() {
  return useMutation({
    mutationKey: ["update-between-question"],
    mutationFn: async ({
      questions,
    }: {
      questions: { questionId: string; order: number }[];
    }) => {
      const response = await $api.organization.question["update-order"].put(
        questions.map((question) => ({
          questionId: question.questionId,
          order: question.order,
        }))
      );

      if (response.error?.value) {
        throw new Error(response.error.value as string);
      }

      return response.data;
    },
  });
}
