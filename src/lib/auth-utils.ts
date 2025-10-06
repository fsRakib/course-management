/**
 * Authentication and session management utilities
 */

export const getDashboardPath = (role: string): string => {
  switch (role) {
    case "student":
      return "/student/dashboard";
    case "developer":
      return "/developer/dashboard";
    case "socialMediaManager":
      return "/manager/dashboard";
    case "admin":
      return "/admin/dashboard";
    case "instructor":
      return "/instructor/dashboard";
    default:
      return "/user/dashboard";
  }
};

export const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case "socialMediaManager":
      return "Manager";
    case "admin":
      return "Admin";
    case "instructor":
      return "Instructor";
    case "developer":
      return "Developer";
    case "student":
      return "Student";
    default:
      return role.charAt(0).toUpperCase() + role.slice(1);
  }
};

export const canAccessRoute = (
  userRole: string,
  routePath: string
): boolean => {
  const rolePermissions: Record<string, string[]> = {
    "/admin": ["admin"],
    "/developer": ["developer", "admin"],
    "/manager": ["socialMediaManager", "admin"],
    "/instructor": ["instructor", "admin"],
    "/student": ["student"],
    "/user": [
      "student",
      "instructor",
      "developer",
      "socialMediaManager",
      "admin",
    ],
  };

  for (const [route, allowedRoles] of Object.entries(rolePermissions)) {
    if (routePath.startsWith(route)) {
      return allowedRoles.includes(userRole);
    }
  }

  return false;
};

export const isPublicRoute = (pathname: string): boolean => {
  const publicRoutes = ["/", "/signin", "/signup", "/unauthorized"];

  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith("/api/auth")
  );
};
