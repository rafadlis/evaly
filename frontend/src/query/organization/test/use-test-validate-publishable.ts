import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useTestValidatePublishable = (testId: string) => {
  return useQuery({
    queryKey: ["test-validate-publishable"],
    queryFn: async () => {
      const res = await $api.organization
        .test({ id: testId })
        ["validate-publish"].get();
      return res.data?.data;
    },
  });
};
