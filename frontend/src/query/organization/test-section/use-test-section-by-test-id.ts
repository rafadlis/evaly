import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useTestSectionByTestIdQuery({testId}:{testId:string}) {
    return useQuery({
        queryKey: ["section-by-test-id",testId],
        queryFn: async () => {
            const response = await $api.organization.test.section.all.get({
                query: {
                    testId
                }
            });
            return response.data?.sections
        },
        enabled: !!testId,
    });
}
