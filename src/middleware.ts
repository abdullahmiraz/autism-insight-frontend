import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const protectedRoutes = ["/detect", "/progress", "/centers"];
  const isProtectedRoute = protectedRoutes.includes(req.nextUrl.pathname);

  // Retrieve authentication token (stored in cookies)
  const token = req.cookies.get("userToken")?.value; // Ensure .value is accessed

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/detect", "/progress", "/centers"], // Protects only these routes
};
