import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useAllQuestionByReferenceIdQuery({referenceId}:{
    referenceId: string
}) {
    return useQuery({
        queryKey: ["questions",referenceId],
        queryFn: async () => {
            const response = await $api.organization.question.all.get({
                query: {
                    referenceId
                }
            });
            return response.data?.questions
        },
        enabled: !!referenceId,
    })
}