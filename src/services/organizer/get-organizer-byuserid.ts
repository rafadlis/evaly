"server-only";

import db from "@/lib/db";

export async function getOrganizerByUserId(userId: string) {
  return await db.query.organizer.findFirst({
    with: {
      organization: true,
    },
    where(fields, { eq }) {
      return eq(fields.userId, userId);
    },
  });
}
