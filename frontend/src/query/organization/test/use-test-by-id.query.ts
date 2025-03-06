import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useTestByIdQuery({ id }: { id: string }) {
  return useQuery({
    queryKey: ["tests-by-id", id],
    queryFn: async () => {
      const response = await $api.organization
        .test({ id: id?.toString() || "" })
        .get();

      return response.data;
    },
    enabled: !!id,
  });
}
