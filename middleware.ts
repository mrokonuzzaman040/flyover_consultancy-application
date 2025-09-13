import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
    const isLoginPage = req.nextUrl.pathname === "/admin/login"

    // If accessing admin routes
    if (isAdminRoute && !isLoginPage) {
      // Check if user is authenticated
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", req.url))
      }

      // Check if user has admin or support role
      if (token.role !== "ADMIN" && token.role !== "SUPPORT") {
        return NextResponse.redirect(new URL("/admin/login", req.url))
      }
    }

    // If already logged in and trying to access login page, redirect to admin
    if (isLoginPage && token) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without token
        if (req.nextUrl.pathname === "/admin/login") {
          return true
        }
        
        // For other admin routes, require token
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"]
}