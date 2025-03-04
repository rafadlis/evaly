import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useSessionByTestIdQuery({testId}:{testId:string}) {
    return useQuery({
        queryKey: ["session-by-test-id",testId],
        queryFn: async () => {
            const response = await $api.organization.test.session.all.get({
                query: {
                    testId
                }
            });
            return response.data?.sessions
        },
        enabled: !!testId,
    });
}
