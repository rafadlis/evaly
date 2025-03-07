import { test } from '../../../lib/db/schema/test.js';
import 'drizzle-orm/pg-core';

declare function createNewTest(data: typeof test.$inferInsert): Promise<{
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
} | undefined>;

export { createNewTest };
