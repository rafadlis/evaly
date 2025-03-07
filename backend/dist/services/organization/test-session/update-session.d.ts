import { UpdateTestSession } from '../../../lib/db/schema/test.session.js';
import 'drizzle-orm';
import 'drizzle-orm/pg-core';

declare function updateSession(sessionId: string, data: UpdateTestSession): Promise<{
    id: string;
    title: string | null;
    duration: number | null;
    order: number | null;
    testId: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}[]>;

export { updateSession };
