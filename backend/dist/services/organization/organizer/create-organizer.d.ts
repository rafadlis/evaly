declare function createOrganizer(userId: string): Promise<{
    organization: {
        type: "school" | "company" | "other" | null;
        id: string;
        name: string;
        logoUrl: string | null;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    };
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    organizationId: string;
    userId: string;
    level: "owner" | "admin";
    organizationRole: "other" | "admin" | "teacher" | "hr" | null;
}>;

export { createOrganizer };
