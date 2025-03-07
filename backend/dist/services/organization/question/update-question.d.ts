import { MediaType } from '../../../types/media.js';
import { UpdateQuestion } from '../../../types/question.js';
import 'drizzle-typebox';
import '@sinclair/typebox';
import 'drizzle-orm/pg-core';
import '../../../lib/db/schema/question.js';
import 'drizzle-orm';
import '../../../types/question-types.js';

declare function updateQuestion(questionId: string, data: UpdateQuestion): Promise<{
    updatedQuestion: {
        id: string;
        question: string | null;
        referenceId: string;
        referenceType: "test-session" | "template" | "ai-generated";
        organizationId: string | null;
        order: number;
        type: "multiple-choice" | "yes-or-no" | "point-based" | "text-field" | "file-upload" | "fill-the-blank" | "audio-response" | "video-response" | "dropdown" | "matching-pairs" | "slider-scale" | "ranking" | "hotspot" | "drag-and-drop" | "matrix" | "likert-scale" | "open-ended" | "code-snippet" | "math-formula" | "drawing" | null;
        pointValue: number | null;
        options: {
            id: string;
            text: string;
            isCorrect: boolean;
            mediaUrl?: string;
            mediaType?: MediaType;
            pointValue?: number;
        }[] | null;
        allowMultipleAnswers: boolean;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    };
}>;

export { updateQuestion };
