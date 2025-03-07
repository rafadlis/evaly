import { Pagination } from '../../../types/pagination.js';

declare function getAllTestsByOrganizationId({ organizationId, sort, page, limit, search, startDate, endDate, }: {
    organizationId: string;
    page?: number;
    limit?: number;
    sort?: "asc-create" | "desc-create" | "asc-held" | "desc-held";
    search?: string;
    startDate?: Date;
    endDate?: Date;
}): Promise<{
    data: {
        type: "live" | "self-paced";
        id: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        organizationId: string;
        description: string | null;
        title: string | null;
        access: "public" | "invite-only" | null;
        isPublished: boolean | null;
        createdByOrganizerId: string;
        heldAt: string | null;
        finishedAt: string | null;
    }[];
    pagination: Pagination;
}>;

export { getAllTestsByOrganizationId };
