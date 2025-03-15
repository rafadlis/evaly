import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useSubmissionDetails = (testId: string, email: string) => {
  return useQuery({
    queryKey: ["submission-details", testId, email],
    queryFn: async () => {
      const res = await $api.organization.test({ id: testId }).submissions({ email }).get();
      return res.data;
    },
    enabled: !!testId && !!email,
  });
}; 