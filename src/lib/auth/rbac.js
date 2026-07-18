import { ROLES } from "./constants";

export function hasAccess(role, requiredAccess) {
  switch (requiredAccess) {
    case "public":
      return true;

    case "member":
      // Any authenticated user can access member routes
      return Boolean(role);

    case "admin":
      // Admin and developer can access admin routes
      return role === ROLES.ADMIN || role === ROLES.DEVELOPER;

    default:
      return false;
  }
}