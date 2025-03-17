import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useQuestionTemplateById(id: string) {
  return useQuery({
    queryKey: ["question-template", id],
    queryFn: async () => {
      const response = await $api.organization.question.template({ id }).get();
      return response.data;
    },
    enabled: !!id,
  });
}
