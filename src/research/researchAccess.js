const FARMER_ROLES = ["farmer"];
const RESEARCH_ROLES = ["field_officer", "researcher", "supervisor", "analyst", "admin", "viewer"];
const ADMIN_ANALYTICS_ROLES = ["admin"];
const VIEWER_RESEARCH_PATHS = ["/research", "/research/reports", "/research/settings"];
const FIELD_COLLECTION_ROLES = ["field_officer", "supervisor", "admin"];
const FIELD_FULL_ACCESS_ROLES = ["field_officer", "supervisor", "admin"];

export function getUserRole(user) {
  if (!user) {
    return null;
  }

  return user.role || user.claims?.role || user.profile?.role || null;
}

export function canAccessFarmer(user) {
  const role = getUserRole(user);
  return FARMER_ROLES.includes(role);
}

export function canAccessResearch(user) {
  const role = getUserRole(user);
  return RESEARCH_ROLES.includes(role);
}

export function canAccessAdminAnalytics(user) {
  const role = getUserRole(user);
  return ADMIN_ANALYTICS_ROLES.includes(role);
}

export function canAccessFieldCollection(user) {
  const role = getUserRole(user);
  return FIELD_COLLECTION_ROLES.includes(role);
}

export function canAccessFieldRoute(user, pathname) {
  const role = getUserRole(user);

  if (!role || !canAccessFieldCollection(user)) {
    return false;
  }

  if (FIELD_FULL_ACCESS_ROLES.includes(role)) {
    return pathname === "/research/field" || pathname.startsWith("/research/field/");
  }

  return false;
}

export function canAccessResearchRoute(user, pathname) {
  const role = getUserRole(user);

  if (!role || !canAccessResearch(user)) {
    return false;
  }

  if (pathname.startsWith("/research/admin")) {
    return canAccessAdminAnalytics(user);
  }

  if (pathname.startsWith("/research/field")) {
    return canAccessFieldRoute(user, pathname);
  }

  if (pathname.startsWith("/research/settings")) {
    return true;
  }

  if (role === "viewer") {
    return VIEWER_RESEARCH_PATHS.includes(pathname);
  }

  return pathname === "/research" || pathname.startsWith("/research/");
}

export function hasResearchWorkspaceAccess(user) {
  return canAccessResearch(user);
}

export {
  ADMIN_ANALYTICS_ROLES,
  FARMER_ROLES,
  FIELD_COLLECTION_ROLES,
  FIELD_FULL_ACCESS_ROLES,
  RESEARCH_ROLES,
  VIEWER_RESEARCH_PATHS,
};
