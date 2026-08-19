import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../../auth/session";
import {
  canAccessAdminAnalytics,
  canAccessFarmer,
  canAccessResearch,
} from "../researchAccess";

function getFallbackPath(user) {
  if (!user) {
    return "/onboarding";
  }

  if (canAccessFarmer(user)) {
    return "/dashboard";
  }

  if (canAccessAdminAnalytics(user)) {
    return "/research/admin";
  }

  if (canAccessResearch(user)) {
    return "/research";
  }

  return "/onboarding";
}

export default function ResearchAccessRestricted() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getStoredUser();
    const timer = window.setTimeout(() => {
      navigate(getFallbackPath(user), { replace: true });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-red-600">Access restricted</p>
        <h1 className="mt-2 text-2xl font-black text-slate-900">Research Mode is protected</h1>
        <p className="mt-3 text-sm text-slate-500">
          This section is only available to admin, researcher, supervisor, and field officer
          roles.
        </p>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          Redirecting
        </p>
      </div>
    </div>
  );
}
