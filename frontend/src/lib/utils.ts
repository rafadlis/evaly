import { Question } from "@evaly/backend/types/question";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Update a question in the questions array
 * @param prevQuestions - The existing questions array
 * @param updatedQuestion - The updated question
 * @returns The updated questions array with the question updated, or the original array if the question is not found
 */
export const updateQuestionInArray = (
  prevQuestions: Question[],
  updatedQuestion: Question
): Question[] => {
  const findIndex = prevQuestions.findIndex((q) => q.id === updatedQuestion.id);

  // If the question is found, update it
  if (findIndex >= 0) {
    return [
      ...prevQuestions.slice(0, findIndex),
      updatedQuestion,
      ...prevQuestions.slice(findIndex + 1),
    ];
  }

  // If the question is not found, return the original array
  return prevQuestions;
};