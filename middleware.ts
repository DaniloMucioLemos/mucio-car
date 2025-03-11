import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPath = request.nextUrl.pathname === "/admin/login";

  if (isAdminPath) {
    if (!token && !isLoginPath) {
      const url = new URL("/admin/login", request.url);
      return NextResponse.redirect(url);
    }

    if (token && isLoginPath) {
      const url = new URL("/admin/dashboard", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
}; 