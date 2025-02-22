import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return dashboardMiddleware(request);
  }
}

async function dashboardMiddleware(request: NextRequest) {
  const sessionRes = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/get-session`,{
    headers: request.headers,
  })

  const sessionJSON = await sessionRes.json();

  if (!sessionJSON || sessionRes.status !== 200) {
    const callbackUrl = request.nextUrl.pathname + request.nextUrl.search;
    return NextResponse.redirect(new URL(`/login?callbackURL=${encodeURIComponent(callbackUrl)}`, request.url));
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
