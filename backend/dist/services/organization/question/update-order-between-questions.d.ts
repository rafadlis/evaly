declare function updateOrderBetweenQuestions(questions: {
    questionId: string;
    order: number;
}[]): Promise<boolean>;

export { updateOrderBetweenQuestions };
