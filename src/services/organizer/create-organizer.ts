import db from "@/lib/db";
import { organization, organizer } from "@/lib/db/schema";

export async function createOrganizer(userId: string) {
  const insertOrganization = await db
    .insert(organization)
    .values({
      name: "My Organization",
    })
    .returning();

  await db.insert(organizer).values({
    organizationId: insertOrganization[0].id,
    userId,
    level: "owner",
  });
}
