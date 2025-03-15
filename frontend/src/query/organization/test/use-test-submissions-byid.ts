import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useTestSubmissionsById = (testId: string) => {
  return useQuery({
    queryKey: ["test-submissions-by-id", testId],
    queryFn: async () => {
      const res = await $api.organization.test({ id: testId }).submissions.get();
      return res.data;
    },
    enabled: !!testId,
    refetchInterval: 1000 * 10, // Auto refetch every 10 seconds
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

