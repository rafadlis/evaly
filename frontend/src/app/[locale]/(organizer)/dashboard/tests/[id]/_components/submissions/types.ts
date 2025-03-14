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
};

export type Question = {
    id: number;
    text: string;
    type: 'multiple_choice' | 'true_false' | 'short_answer';
    correctAnswer: string;
    participantAnswer: string | null;
    isCorrect: boolean | null;
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