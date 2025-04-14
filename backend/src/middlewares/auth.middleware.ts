import { Context } from "elysia";
import { auth } from "../lib/auth";
import { getSelectedOrganizerByUserId } from "../services/organization/organizer/get-selected-organizer-byuserid";
import { createOrganizer } from "../services/organization/organizer/create-organizer";

export const organizationMiddleware = async ({ request, error }: Context) => {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return error("Unauthorized", "Unauthorized Access: Token is missing");
    }

    let organizer = await getSelectedOrganizerByUserId(session.user.id);

    if (!organizer) {
      organizer = await createOrganizer(session.user.id);
    }

    return {
      user: session.user,
      session: session.session,
      organizer: organizer,
    };
  } catch (errorBody: any) {
    return error("Internal Server Error", errorBody.message);
  }
};

export const participantMiddleware = async ({ request, error }: Context) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return error(401, "Please log in to access this");
  }

  return {
    user: session?.user,
    session: session?.session,
  };
};
