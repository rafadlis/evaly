import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useTestQuery({ limit, page }: { limit: number; page: number }) {
  return useQuery({
    queryKey: ["tests", limit, page],
    queryFn: async () => {
      const response = await $api.organization.test.all.get({
        query: { limit, page },
      });
      return response.data;
    },
  });
}
