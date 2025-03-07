declare function createSession(testId: string): Promise<{
    sessions: {
        duration: number | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        description: string | null;
        title: string | null;
        order: number | null;
        testId: string;
    }[];
}>;

export { createSession };
