import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const protectedRoutes = ["/detect", "/progress", "/centers"];
  const adminRoute = "/admin";
  const isProtectedRoute = protectedRoutes.includes(req.nextUrl.pathname);
  const isAdminRoute = req.nextUrl.pathname === adminRoute;

  // Retrieve authentication token (stored in cookies)
  const token = req.cookies.get("userToken")?.value;
  const adminToken = req.cookies.get("adminToken")?.value;

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminRoute && !adminToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes and admin route
export const config = {
  matcher: ["/detect", "/progress", "/centers", "/admin"],
};
