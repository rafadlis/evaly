import "server-only";

import db from "@/lib/db";
import { organization, organizer, user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function createOrganizer(userId: string) {
  const insertOrganization = await db
    .insert(organization)
    .values({
      name: "My Organization",
    })
    .returning();

  const insertOrganizer = await db
    .insert(organizer)
    .values({
      organizationId: insertOrganization[0].id,
      userId,
      level: "owner",
    })
    .returning();

  await db
    .update(user)
    .set({
      selectedOrganizerId: insertOrganizer[0].id,
    })
    .where(eq(user.id, userId));
}
