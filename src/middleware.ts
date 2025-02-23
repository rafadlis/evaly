import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./services/common/get-session";
import { getSelectedOrganizerByUserId } from "./services/organization/organizer/get-selected-organizer-byuserid";
import { createOrganizer } from "./services/organization/organizer/create-organizer";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return dashboardMiddleware(request);
  }

  return NextResponse.next();
}

async function dashboardMiddleware(request: NextRequest) {
  const sessionRes = await getSession(request.headers);

  if (!sessionRes?.user) {
    const callbackUrl = request.nextUrl.pathname + request.nextUrl.search;
    return NextResponse.redirect(
      new URL(
        `/login?callbackURL=${encodeURIComponent(callbackUrl)}`,
        request.url
      )
    );
  }

  const data = await getSelectedOrganizerByUserId(sessionRes.user.id);
  
  if (!data) {
    await createOrganizer(sessionRes.user.id);
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico, sitemap.xml, robots.txt (metadata files)
   */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
