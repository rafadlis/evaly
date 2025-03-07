declare function getSelectedOrganizerByUserId(userId: string): Promise<{
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    organizationId: string;
    userId: string;
    level: "owner" | "admin";
    organizationRole: "other" | "admin" | "teacher" | "hr" | null;
    organization: {
        type: "school" | "company" | "other" | null;
        id: string;
        name: string;
        logoUrl: string | null;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    };
} | undefined>;

export { getSelectedOrganizerByUserId };
