import { useQuery } from "@tanstack/react-query";
import { $api } from "@/lib/api";

export interface TestSubmission {
  id: string;
  name: string;
  image: string | null;
  email: string;
  totalQuestions: number;
  answered: number;
  correct: number;
  wrong: number;
  unanswered: number;
  submittedAt: string | null;
  startedAt: string | null;
  score: number;
  rank: number;
  sectionAnswers: Record<string, number>;
  sectionCorrect: Record<string, number>;
  sectionWrong: Record<string, number>;
  status: 'completed' | 'in-progress' | 'not-started';
}

export interface TestSection {
  id: string;
  name: string;
  questionsCount: number;
}

export interface TestSubmissionsResponse {
  submissions: TestSubmission[];
  sections: TestSection[];
  timestamp: string;
}

export const useTestSubmissionsById = (testId: string, refetchInterval: number = 30000) => {
  return useQuery<TestSubmissionsResponse>({
    queryKey: ["test-submissions", testId],
    queryFn: async () => {
      const response = await $api.organization.test({ id: testId }).submissions.get();
      return response.data as TestSubmissionsResponse;
    },
    enabled: !!testId,
    refetchInterval: refetchInterval,
  });
};

