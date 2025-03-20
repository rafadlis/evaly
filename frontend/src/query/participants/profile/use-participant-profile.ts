import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useParticipantProfile() {
  return useQuery({
    queryKey: ["participant-profile"],
    queryFn: async () => {
      const response = await $api.participant.profile.get();
      return response.data;
    },
  });
}
