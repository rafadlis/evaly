import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useAttemptById(attemptId: string) {
  return useQuery({
    queryKey: ["attempt", attemptId],
    queryFn: async()=>{
      const res = await $api.participant.test.attempt({ id: attemptId }).get();

      if (res.status !== 200) {
        throw new Error(res.error?.value.toString());
      }

      return res.data;
    }
  });
}