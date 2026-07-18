export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  RECRUITMENT: "/recruitment",
  FORBIDDEN: "/forbidden",
};

export const ACCESS = {
  PUBLIC: "public",
  MEMBER: "member",
  ADMIN: "admin",
};

/**
 * Centralized route protection rules.
 * Add every protected route here.
 */
export const ROUTE_RULES = [
  {
    pattern: "/dashboard",
    access: ACCESS.MEMBER,
  },

  {
    pattern: "/admin",
    access: ACCESS.ADMIN,
  },

  {
    pattern: "/admin/:path*",
    access: ACCESS.ADMIN,
  },
];