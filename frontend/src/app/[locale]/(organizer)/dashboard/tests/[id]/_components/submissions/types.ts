export type Submission = {
    id: number;
    name: string;
    email: string;
    totalQuestions: number;
    answered: number;
    correct: number;
    wrong: number;
    unanswered: number;
    submittedAt: string;
    score: number;
    rank?: number; // Added for ranking
    sectionId: string; // Changed to string for section filtering
    sectionAnswers?: Record<string, number>; // Changed to string keys for section IDs
    sectionCorrect?: Record<string, number>; // Changed to string keys for section IDs
    sectionWrong?: Record<string, number>; // Changed to string keys for section IDs
};

export type Section = {
    id: string; // Changed to string to match API response
    name: string;
    questionsCount: number; // Number of questions in this section
};

export type Question = {
    id: string;
    text: string;
    type: 'multiple_choice' | 'true_false' | 'short_answer';
    correctAnswer: string;
    participantAnswer: string | null;
    isCorrect: boolean | null;
    sectionId: string; // Changed to string to match section IDs
};

export type SortConfig = {
    key: keyof Submission | null;
    direction: 'asc' | 'desc';
};

export type Column = {
    key: keyof Submission;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: string;
    render?: (value: Submission[keyof Submission], submission: Submission) => React.ReactNode;
    searchable?: boolean;
}; 