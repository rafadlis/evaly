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
    sectionId: number; // Added for section filtering
    sectionAnswers?: Record<number, number>; // Questions answered per section
    sectionCorrect?: Record<number, number>; // Correct answers per section
    sectionWrong?: Record<number, number>; // Wrong answers per section
};

export type Section = {
    id: number;
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
    sectionId: number; // Added for section filtering
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