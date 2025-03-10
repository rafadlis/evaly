import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useTestById(testId: string) {
  return useQuery({
    queryKey: ["test", testId],
    queryFn: async () => {
      const response = await $api.participant.test({ id: testId }).get();
      if (response.error?.value) {
        throw new Error(response.error.value.toString(), {
          cause: response.error.status,
        });
      }
      return response.data;
    },
    enabled: !!testId,
  });
}
