// Entire research / FMNR workspace, mounted as one lazy chunk under /research/*.
//
// App.jsx only imports this module when RESEARCH_WORKSPACE_ENABLED is true, so
// production builds never pull it — or anything it imports — into the bundle.
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { getStoredUser } from "../auth/session";
import AccessRestricted from "../components/AccessRestricted";
import SettingsPage from "../settings/SettingsPage";
import ResearchShell from "./layout/ResearchShell";
import ChildNutrition from "./pages/ChildNutrition";
import FieldActivity from "./pages/FieldActivity";
import FMNRPlots from "./pages/FMNRPlots";
import Households from "./pages/Households";
import Reports from "./pages/Reports";
import ResearchDashboard from "./pages/ResearchDashboard";
import SyncStatus from "./pages/SyncStatus";
import AdminOverview from "./pages/admin/AdminOverview";
import ChildDietScores from "./pages/admin/ChildDietScores";
import CountyComparison from "./pages/admin/CountyComparison";
import Exports from "./pages/admin/Exports";
import FMNRMap from "./pages/admin/FMNRMap";
import Devices from "./pages/field/Devices";
import Drafts from "./pages/field/Drafts";
import FieldCollectionHome from "./pages/field/FieldCollectionHome";
import FormBuilder from "./pages/field/FormBuilder";
import FormPreview from "./pages/field/FormPreview";
import FormsLibrary from "./pages/field/FormsLibrary";
import Submissions from "./pages/field/Submissions";
import SyncQueue from "./pages/field/SyncQueue";
import { canAccessAdminAnalytics, canAccessResearchRoute } from "../auth/access";

function ResearchProtectedRoute() {
  const user = getStoredUser();
  const location = useLocation();

  if (!canAccessResearchRoute(user, location.pathname)) {
    return <AccessRestricted />;
  }

  return <ResearchShell user={user} />;
}

function AdminProtectedRoute() {
  const user = getStoredUser();

  if (!canAccessAdminAnalytics(user)) {
    return <AccessRestricted />;
  }

  return <Outlet />;
}

export default function ResearchApp() {
  return (
    <Routes>
      <Route element={<ResearchProtectedRoute />}>
        <Route index element={<ResearchDashboard />} />
        <Route path="households" element={<Households />} />
        <Route path="fmnr-plots" element={<FMNRPlots />} />
        <Route path="child-nutrition" element={<ChildNutrition />} />
        <Route path="field-activity" element={<FieldActivity />} />
        <Route path="sync-status" element={<SyncStatus />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<SettingsPage workspace="research" />} />
        <Route path="settings/:panel" element={<SettingsPage workspace="research" />} />
        <Route path="field">
          <Route index element={<FieldCollectionHome />} />
          <Route path="forms" element={<FormsLibrary />} />
          <Route path="forms/new" element={<FormBuilder />} />
          <Route path="forms/:formId" element={<FormPreview />} />
          <Route path="submissions" element={<Submissions />} />
          <Route path="drafts" element={<Drafts />} />
          <Route path="devices" element={<Devices />} />
          <Route path="sync-queue" element={<SyncQueue />} />
        </Route>
        <Route path="admin" element={<AdminProtectedRoute />}>
          <Route index element={<AdminOverview />} />
          <Route path="fmnr-map" element={<FMNRMap />} />
          <Route path="diet-scores" element={<ChildDietScores />} />
          <Route path="county" element={<CountyComparison />} />
          <Route path="exports" element={<Exports />} />
        </Route>
      </Route>
    </Routes>
  );
}
