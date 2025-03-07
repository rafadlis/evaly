declare function getSessionById(sessionId: string): Promise<{
    duration: number | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    description: string | null;
    title: string | null;
    order: number | null;
    testId: string;
} | undefined>;

export { getSessionById };
