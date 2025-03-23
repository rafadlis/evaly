import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useGetInitialMessages(id: string) {
  return useQuery({
    queryKey: ["llm-initial-messages", id],
    queryFn: async () => {
      const response = await $api.organization.question.llm.chat({ id }).get();
      return response.data;
    },
  });
}
