import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useAllQuestionTemplate() {
  return useQuery({
    queryKey: ["question-template"],
    queryFn: async () => {
      const response = await $api.organization.question.template.all.get();
      return response.data;
    },
  });
}
