import { MediaType } from '../../../types/media.js';
import { InsertQuestion } from '../../../types/question.js';
import 'drizzle-typebox';
import '@sinclair/typebox';
import 'drizzle-orm/pg-core';
import '../../../lib/db/schema/question.js';
import 'drizzle-orm';
import '../../../types/question-types.js';

declare function createQuestion(listQuestion: InsertQuestion[]): Promise<{
    options: {
        id: string;
        text: string;
        isCorrect: boolean;
        mediaUrl?: string;
        mediaType?: MediaType;
        pointValue?: number;
    }[] | null;
    type: "multiple-choice" | "yes-or-no" | "text-field" | "file-upload" | "fill-the-blank" | "audio-response" | "video-response" | "dropdown" | "matching-pairs" | "slider-scale" | "ranking" | "hotspot" | "drag-and-drop" | "matrix" | "likert-scale" | "open-ended" | "code-snippet" | "math-formula" | "drawing" | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    organizationId: string | null;
    question: string | null;
    referenceId: string;
    referenceType: "test-session" | "template" | "ai-generated";
    order: number;
    pointValue: number | null;
    allowMultipleAnswers: boolean;
}[]>;

export { createQuestion };
