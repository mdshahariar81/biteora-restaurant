import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
 * Biteora Dashboard Route Protection
 *
 * This development Proxy:
 * 1. Checks whether a session exists.
 * 2. Reads the temporary development role.
 * 3. Restricts dashboard sections according to role.
 *
 * IMPORTANT:
 * This is NOT the final backend authorization layer.
 *
 * Every protected API endpoint must independently verify:
 * - session
 * - user identity
 * - role
 * - permission
 */

const SESSION_COOKIE_NAME = "biteora_session";
const ROLE_COOKIE_NAME = "biteora_role";

/*
 * Role-based route permissions.
 *
 * OWNER:
 * Can access everything.
 *
 * ADMIN:
 * Cannot access Staff or Settings.
 *
 * WORKER:
 * Can only access Dashboard and Orders.
 */
const ROLE_ALLOWED_ROUTES = {
OWNER: [
  "/dashboard",
  "/dashboard/orders",
  "/dashboard/products",
  "/dashboard/coupons",
  "/dashboard/customers",
  "/dashboard/reports",
  "/dashboard/staff",
  "/dashboard/settings",
],

  ADMIN: [
    "/dashboard",
    "/dashboard/orders",
    "/dashboard/products",
    "/dashboard/coupons",
    "/dashboard/customers",
    "/dashboard/reports",
  ],

  WORKER: [
    "/dashboard",
    "/dashboard/orders",
  ],
} as const;

type UserRole = keyof typeof ROLE_ALLOWED_ROUTES;

/*
 * Check whether a role can access a route.
 */
function canAccessRoute(
  role: UserRole,
  pathname: string,
): boolean {
  const allowedRoutes = ROLE_ALLOWED_ROUTES[role];

  /*
   * /dashboard itself is accessible to all authenticated roles.
   */
  if (pathname === "/dashboard") {
    return allowedRoutes.includes("/dashboard");
  }

  /*
   * Check whether the requested path belongs
   * to one of the role's allowed sections.
   */
  return allowedRoutes.some((route) => {
    if (route === "/dashboard") {
      return false;
    }

    return (
      pathname === route ||
      pathname.startsWith(`${route}/`)
    );
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute =
    pathname.startsWith("/dashboard");

  const isLoginRoute =
    pathname.startsWith("/auth/login");

  /*
   * Read authentication cookies.
   */
  const sessionCookie = request.cookies.get(
    SESSION_COOKIE_NAME,
  );

  const roleCookie = request.cookies.get(
    ROLE_COOKIE_NAME,
  );

  const hasSession = Boolean(sessionCookie?.value);

  const role = roleCookie?.value as
    | UserRole
    | undefined;

  /*
   * --------------------------------------------------
   * PROTECTED DASHBOARD
   * --------------------------------------------------
   */

  if (isDashboardRoute) {
    /*
     * No session → login.
     */
    if (!hasSession) {
      const loginUrl = new URL(
        "/auth/login",
        request.url,
      );

      loginUrl.searchParams.set(
        "callbackUrl",
        pathname,
      );

      return NextResponse.redirect(loginUrl);
    }

    /*
     * Session exists but role is missing/invalid.
     */
    if (
      !role ||
      !(role in ROLE_ALLOWED_ROUTES)
    ) {
      /*
       * Remove invalid development session.
       */
      const response =
        NextResponse.redirect(
          new URL("/auth/login", request.url),
        );

      response.cookies.delete(
        SESSION_COOKIE_NAME,
      );

      response.cookies.delete(
        ROLE_COOKIE_NAME,
      );

      return response;
    }

    /*
     * Role exists but user does not have permission
     * to access this section.
     */
    if (!canAccessRoute(role, pathname)) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url),
      );
    }
  }

  /*
   * --------------------------------------------------
   * LOGIN PAGE
   * --------------------------------------------------
   */

  if (isLoginRoute && hasSession) {
    /*
     * If already authenticated, don't show login again.
     */
    return NextResponse.redirect(
      new URL("/dashboard", request.url),
    );
  }

  return NextResponse.next();
}

/*
 * Only run Proxy for authentication-related routes.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/login",
  ],
};