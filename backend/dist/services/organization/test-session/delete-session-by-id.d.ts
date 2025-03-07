declare function deleteSessionById(sessionId: string): Promise<{
    sessionRowChanges: number;
    questionRowChanges: number;
}>;

export { deleteSessionById };
