// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const ROLE_DASHBOARD = {
//   0: "/select-role",
//   1: "/employers-dashboard/dashboard",
//   2: "/employers-dashboard/dashboard",
//   3: "/",                   
//   4: "/candidates-dashboard/dashboard",
//   5: "/",
// };

// // Unprotected routes (from your app folder) that anyone can access (except "/" which is special).
// const unprotectedRoutes = ["/about", "/contact", "/auth/login", "/auth/signup"];

// // Role-protected routes for each role.
// const protectedRoutes = {
//   1: [
//     "/employers-dashboard",
//     "/employers-dashboard/dashboard",
//     "/employers-dashboard/settings",
//   ],
//   2: [
//     "/employers-dashboard",
//     "/employers-dashboard/dashboard",
//     "/employers-dashboard/settings",
//   ],
//   3: [
//     "/recruiter",
//     "/recruiter/profile",
//     "/recruiter/jobs",
//     "/recruiter-dashboard/dashboard",
//   ],
//   4: [
//     "/candidates-dashboard",
//     "/candidates-dashboard/dashboard",
//     "/candidates-dashboard/profile",
//   ],
//   5: [
//     "/candidates-dashboard",
//     "/candidates-dashboard/dashboard",
//     "/candidates-dashboard/profile",
//   ],
// };

// export async function middleware(req) {
//   const { pathname } = req.nextUrl;
//   console.info("Middleware running for:", pathname);

//   // SPECIAL HANDLING FOR THE HOME PAGE ("/")
//   if (pathname === "/") {
//     const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//     if (req.nextUrl.searchParams.get("roleSelected") === "true") {
//       return NextResponse.next();
//     }
//     if (!token) {
//       return NextResponse.next();
//     }

//     const role = Number(token.role);
//     const destination = ROLE_DASHBOARD[role] || "/";

//     // Prevent redirecting to the same path to avoid infinite loop
//     if (destination !== pathname && role !== 3) {
//       return NextResponse.redirect(new URL(destination, req.url));
//     }

//     return NextResponse.next();
//   }

//   // For other unprotected routes (excluding "/")
//   if (unprotectedRoutes.some((route) => pathname === route)) {
//     return NextResponse.next();
//   }

//   // For all other routes, try to retrieve the token.
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   console.info("Token from middleware:", token);

//   if (!token) {
//     // No token: redirect to login.
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   const role = Number(token.role);
//   console.info("User role:", role);

//   // If a logged-in user is trying to access the login page, redirect them to their dashboard.
//   if (pathname.startsWith("/auth/login")) {
//     const destination =
//       ROLE_DASHBOARD[role] || "/candidates-dashboard/dashboard";
//     return NextResponse.redirect(new URL(destination, req.url));
//   }

//   // Check if the current pathname is allowed for this role.
//   const allowedRoutes = protectedRoutes[role] || [];
//   const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

//   console.info("isAllowed:", isAllowed, "for pathname:", pathname);

//   if (isAllowed) {
//     return NextResponse.next();
//   }

//   // For any non-allowed route, redirect to the user's dashboard.
//   const destination = ROLE_DASHBOARD[role] || "/";
//   return NextResponse.redirect(new URL(destination, req.url));
// }

// // Matcher: Run middleware on routes inside your app folder. Adjust these paths as needed.
// export const config = {
//   matcher: [
//     "/employers-dashboard/:path*",
//     "/recruiter/:path*",
//     "/candidates-dashboard/:path*",
//     "/recruiter-dashboard/:path*",
//     "/auth/:path*",
//     "/",
//   ],
// };

// ABOVE IS WORKING after i did the candiate login seelction either candidate or recruiter



import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ROLE_DASHBOARD = {
  0: "/select-role",
  1: "/employers-dashboard/dashboard",
  2: "/employers-dashboard/dashboard",
  3: "/",                   
  4: "/candidates-dashboard/dashboard",
  5: "/candidates-dashboard/dashboard",   // dashboard mapping, but role 5 won't auto-redirect off "/"
};

// Unprotected routes (from your app folder) that anyone can access (except "/" which is special).
const unprotectedRoutes = ["/about", "/contact", "/auth/login", "/auth/signup"];

// Role-protected routes for each role.
const protectedRoutes = {
  1: [
    "/employers-dashboard",
    "/employers-dashboard/dashboard",
    "/employers-dashboard/settings",
  ],
  2: [
    "/employers-dashboard",
    "/employers-dashboard/dashboard",
    "/employers-dashboard/settings",
  ],
  3: [
    "/recruiter",
    "/recruiter/profile",
    "/recruiter/jobs",
    "/recruiter-dashboard/dashboard",
  ],
  4: [
    "/candidates-dashboard",
    "/candidates-dashboard/dashboard",
    "/candidates-dashboard/profile",
  ],
  5: [
    "/candidates-dashboard",
    "/candidates-dashboard/dashboard",
    "/candidates-dashboard/profile",
  ],
};

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  console.info("Middleware running for:", pathname);

  // SPECIAL HANDLING FOR THE HOME PAGE ("/")
  if (pathname === "/") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Guests or just-picked-role => stay on home
    if (!token || req.nextUrl.searchParams.get("roleSelected") === "true") {
      return NextResponse.next();
    }

    const role = Number(token.role);

    // Roles 3 & 5 stay on "/" until they click a dashboard link
    if (role === 3 || role === 5) {
      return NextResponse.next();
    }

    // All other roles: auto-redirect off "/"
    const destination = ROLE_DASHBOARD[role] || "/";
    if (destination !== "/") {
      return NextResponse.redirect(new URL(destination, req.url));
    }
    return NextResponse.next();
  }

  // Allow public pages
  if (unprotectedRoutes.some((route) => pathname === route)) {
    return NextResponse.next();
  }

  // Everything else requires a valid session
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.info("Token from middleware:", token);

  if (!token) {
    // No session → send to home/login
    return NextResponse.redirect(new URL("/", req.url));
  }

  const role = Number(token.role);
  console.info("User role:", role);

  // If a signed-in user hits the login page, bounce them to their dashboard
  if (pathname.startsWith("/auth/login")) {
    const destination = ROLE_DASHBOARD[role] || "/";
    return NextResponse.redirect(new URL(destination, req.url));
  }

  // Check role-based access
  const allowedRoutes = protectedRoutes[role] || [];
  const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));
  console.info("isAllowed:", isAllowed, "for pathname:", pathname);

  if (isAllowed) {
    return NextResponse.next();
  }

  // Fallback: redirect to their dashboard
  const destination = ROLE_DASHBOARD[role] || "/";
  return NextResponse.redirect(new URL(destination, req.url));
}

// Matcher: apply this middleware under your app routes
export const config = {
  matcher: [
    "/employers-dashboard/:path*",
    "/recruiter/:path*",
    "/candidates-dashboard/:path*",
    "/recruiter-dashboard/:path*",
    "/auth/:path*",
    "/",
  ],
};







