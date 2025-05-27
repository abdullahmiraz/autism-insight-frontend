import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const protectedRoutes = ["/detect", "/progress", "/centers"];
  const adminRoutes = ["/admin", "/users"];
  const isProtectedRoute = protectedRoutes.includes(req.nextUrl.pathname);
  const isAdminRoute = adminRoutes.includes(req.nextUrl.pathname);

  // Retrieve authentication token (stored in cookies)
  const token = req.cookies.get("userToken")?.value;
  const userEmail = req.cookies.get("userEmail")?.value;
  const adminToken = req.cookies.get("adminToken")?.value;

  // Get the base URL for redirects
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

  // For protected routes, just check if user is logged in
  if (isProtectedRoute && !token) {
    const url = new URL("/login", baseUrl);
    url.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // For admin routes, check both token and admin role
  if (isAdminRoute) {
    if (!token || !userEmail) {
      const url = new URL("/login", baseUrl);
      url.searchParams.set("redirectTo", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Check if user is admin by looking at the adminToken
    if (!adminToken) {
      return NextResponse.redirect(new URL("/", baseUrl));
    }
  }

  return NextResponse.next();
}

// Apply middleware to protected routes and admin route
export const config = {
  matcher: ["/detect", "/progress", "/centers", "/admin", "/users"],
};
