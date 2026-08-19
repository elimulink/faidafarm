import { Outlet } from "react-router-dom";
import ResearchMobileBottomNav from "./ResearchMobileBottomNav";
import ResearchSidebar from "./ResearchSidebar";
import ResearchTopbar from "./ResearchTopbar";

export default function ResearchShell({ user }) {
  return (
    <div className="research-workspace min-h-screen bg-white text-[#14213D]">
      <div className="flex">
        <ResearchSidebar user={user} />
        <main className="min-w-0 flex-1">
          <ResearchTopbar user={user} />
          <div className="mx-auto max-w-7xl px-4 pb-24 pt-7 lg:px-8 lg:pb-7 lg:pt-7">
            <Outlet />
          </div>
          <ResearchMobileBottomNav user={user} />
        </main>
      </div>
    </div>
  );
}
