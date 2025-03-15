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
    staleTime: 3000, // Data will be considered fresh for 3 seconds (debounce)
    gcTime: 5 * 60 * 1000, // Keep the data in cache for 5 minutes after component unmounts
    // refetchInterval: 10000, // Auto refetch every 10 seconds to ensure data stays relatively fresh
    // refetchIntervalInBackground: false, // Only refetch when tab is in foreground
    // refetchOnWindowFocus: true, // Refetch when user returns to the tab
    // refetchOnMount: true, // Refetch when component mounts
    // refetchOnReconnect: true, // Refetch when reconnecting after being offline
  });
};

