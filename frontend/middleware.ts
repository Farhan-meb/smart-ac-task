import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth?.token;
        const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

        // If user is authenticated and trying to access auth pages, redirect to dashboard
        if (token && isAuthPage) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Protect all routes except auth pages and public assets
                const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
                const isPublicAsset =
                    req.nextUrl.pathname.startsWith("/_next") ||
                    req.nextUrl.pathname.startsWith("/api/auth") ||
                    req.nextUrl.pathname === "/" ||
                    req.nextUrl.pathname.startsWith("/favicon");

                // If it's an auth page, allow access
                if (isAuthPage) {
                    return true;
                }

                // If it's a public asset, allow access
                if (isPublicAsset) {
                    return true;
                }

                // For all other routes, require authentication
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (NextAuth API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    ],
};
