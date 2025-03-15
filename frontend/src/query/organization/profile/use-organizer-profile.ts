import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useOrganizerProfile() {
  return useQuery({
    queryKey: ["organization-profile"],
    queryFn: async () => {
      const response = await $api.organization.profile.get();
      return response;
    },
  });
}
