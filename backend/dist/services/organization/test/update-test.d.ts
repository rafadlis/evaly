import { UpdateTest } from '../../../types/test.js';
import '../../../lib/db/schema/test.js';
import 'drizzle-orm/pg-core';
import '../../../lib/db/schema/test.session.js';
import 'drizzle-orm';

declare function updateTest({ id, data, organizationId, }: {
    id: string;
    data: UpdateTest;
    organizationId: string;
}): Promise<{
    id: string;
    title: string | null;
    type: "live" | "self-paced";
    access: "public" | "invite-only" | null;
    isPublished: boolean | null;
    description: string | null;
    createdByOrganizerId: string;
    organizationId: string;
    heldAt: string | null;
    finishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}>;

export { updateTest };
