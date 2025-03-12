import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useTestSectionByIdQuery({id}:{id:string}) {
    return useQuery({
        queryKey: ["section", id],
        queryFn: async () => {
          const response = await $api.organization.test
            .section({ id:  id as string })
            .get();
          return response.data;
        },
        enabled: !!id,
      });
}