import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Define public paths that don't require authentication
const publicPaths = ["/", "/sign-in", "/sign-up", "/unauthorized", "/auth/callback"]; // /auth/callback eklendi

// Define paths that should be accessible even without authentication
// (e.g., API routes, static assets). This helps avoid unnecessary checks.
// We can refine this based on the config.matcher later if needed.
const excludedPaths = [
   "/_next/", // Next.js internal paths
   "/api/", // API routes (adjust if your API needs auth)
   "/favicon.ico", // Favicon
   // Add other static file extensions if necessary
];

export async function middleware(request: NextRequest) {
   const { pathname } = request.nextUrl;

   // Check if the path is excluded from authentication checks
   if (excludedPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.next(); // Allow request without session update/check
   }

   let response = NextResponse.next({
      request: {
         headers: request.headers,
      },
   });

   const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
         get(name: string) {
            return request.cookies.get(name)?.value;
         },
         set(name: string, value: string, options) {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
               request: {
                  headers: request.headers,
               },
            });
            response.cookies.set({ name, value, ...options });
         },
         remove(name: string, options) {
            request.cookies.set({ name, value: "", ...options });
            response = NextResponse.next({
               request: {
                  headers: request.headers,
               },
            });
            response.cookies.set({ name, value: "", ...options });
         },
      },
   });

   // Refresh session and get user data
   const {
      data: { user },
   } = await supabase.auth.getUser();

   // Check if the path is public
   const isPublicAuthPath = ["/sign-in", "/sign-up"].includes(pathname);
   const isPublicPath = publicPaths.includes(pathname);

   // --- Redirection Logic ---

   // 1. If user is logged in and tries to access sign-in or sign-up, redirect to their page
   if (user && isPublicAuthPath) {
      console.log(`Redirecting logged-in user from ${pathname} to /${user.id}`);
      return NextResponse.redirect(new URL(`/profile`, request.url));
   }

   // 2. If user is NOT logged in and tries to access a protected path, rewrite to unauthorized
   if (!user && !isPublicPath) {
      console.log(`Rewriting unauthenticated user from ${pathname} to /unauthorized`);
      return NextResponse.rewrite(new URL("/unauthorized", request.url));
   }

   // 3. Allow all other requests (logged-in user on any allowed path, or anonymous user on public path)
   // The session is already refreshed by supabase.auth.getUser()
   console.log(`Allowing request for ${pathname}. Public: ${isPublicPath}, User: ${!!user}`);
   return response;
}

export const config = {
   matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       * Feel free to modify this pattern to include more paths.
       */
      "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
   ],
};
