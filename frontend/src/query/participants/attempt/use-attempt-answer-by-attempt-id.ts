import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useAttemptAnswerByAttemptId = (attemptId: string) => {
  return useQuery({
    queryKey: ["attempt-answer-by-attempt-id", attemptId],
    queryFn: async () => {
      const res = await $api.participant.test.attempt({ id: attemptId }).answers.get()
      return res.data;
    },
  });
};