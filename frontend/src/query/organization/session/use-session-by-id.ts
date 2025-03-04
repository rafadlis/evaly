import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useSessionByIdQuery({id}:{id:string}) {
    return useQuery({
        queryKey: ["session", id],
        queryFn: async () => {
          const response = await $api.organization.test
            .session({ id:  id as string })
            .get();
          return response.data;
        },
        enabled: !!id,
      });
}