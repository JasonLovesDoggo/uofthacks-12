import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "./lib/auth";

const protectedRoutes = ["/"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);
  const isProtectedRoute = protectedRoutes.includes(request.nextUrl.pathname);

  // Redirect authenticated users away from auth routes
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Redirect unauthenticated users from protected routes
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
