export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

import { question } from "./lib/db/schema/question";
import { test } from "./lib/db/schema/test";
import { testSession } from "./lib/db/schema/test.session";

// Define question types as a constant that can be reused
export const QUESTION_TYPES = [
  "single-choice", // Participant selects 1 correct answer (radio buttons)
  "multiple-choice", // Participant can select more than 1 correct answer (checkboxes)
  "yes-or-no", // Simple binary choice (Yes/No)
  "point-based", // Answer earns points based on correctness
  "text-field", // Open-ended text response
  "file-upload", // Participant uploads a file as an answer
  "fill-the-blank", // Participant fills in missing words in a sentence
  "audio-response", // Participant records and submits an audio response
  "video-response", // Participant records and submits a video response
  "dropdown", // Single-choice selection from a dropdown menu
  "ranking", // Participants reorder options based on priority/preference
  "slider-scale", // Select a value on a sliding scale (e.g., 1-10)
  "date-picker", // Select a date from a calendar input
  "time-picker", // Select a specific time
  "image-choice", // Choose an answer by selecting an image
  "matching-pairs", // Drag & drop or dropdown-based matching of related terms
  "matrix", // Grid-based response format for rating multiple items at once
  "hotspot", // Click on a specific area in an image as the answer
  "formula-input", // Input mathematical expressions or equations
  "code-editor", // Answer by writing and submitting code (for programming assessments)
] as const;

// Define media types constant
export const MEDIA_TYPES = ["audio", "video", "file", "image"] as const;


export type MediaType = typeof MEDIA_TYPES
export type Question = typeof question.$inferSelect;
export type InsertQuestion = typeof question.$inferInsert
export type UpdateQuestion = Partial<InsertQuestion>;


export interface BaseQuestionInput {
  question: string;
  referenceId: string;
  order?: number;
}

export type QuestionType = typeof QUESTION_TYPES[number];

export interface ChoiceQuestionInput extends BaseQuestionInput {
  type:
    | "single-choice"
    | "multiple-choice"
    | "yes-or-no"
    | "point-based"
    | "dropdown"
    | "image-choice";
  options: Array<{
    optionText: string;
    isCorrect?: boolean;
    pointValue?: number;
    order?: number;
    imageUrl?: string;
  }>;
}

export interface TextFieldQuestionInput extends BaseQuestionInput {
  type: "text-field";
  textField: {
    modelAnswer?: string;
    minLength?: number;
    maxLength?: number;
    placeholder?: string;
  };
}

export interface FillBlankQuestionInput extends BaseQuestionInput {
  type: "fill-the-blank";
  segments: Array<{
    segmentOrder: number;
    segmentText?: string;
    isBlank: boolean;
    expectedAnswer?: string;
  }>;
}

export interface MediaQuestionInput extends BaseQuestionInput {
  type: "file-upload" | "audio-response" | "video-response";
  mediaConfig: {
    mediaType: MediaType;
    allowedFormats?: string[];
    maxFileSizeMb?: number;
    sampleResponseUrl?: string;
    instructions?: string;
  };
}

export type Test = typeof test.$inferSelect;
export type InsertTest = typeof test.$inferInsert;
export type UpdateTest = Partial<InsertTest>;

export type TestSession = typeof testSession.$inferSelect;
export type InsertTestSession = typeof testSession.$inferInsert;
export type UpdateTestSession = Partial<InsertTestSession>;