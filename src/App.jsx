import { Suspense, lazy, useState } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import AlertsModule from "./modules/farmer/AlertsModule";
import FindBuyersModule from "./modules/farmer/FindBuyersModule";
import DashboardModule from "./modules/farmer/DashboardModule";
import FarmerForgotPasswordPage from "./modules/farmer/FarmerForgotPasswordPage";
import FarmerLoginPage from "./modules/farmer/FarmerLoginPage";
import FarmerOtpVerificationPage from "./modules/farmer/FarmerOtpVerificationPage";
import FarmerResetPasswordPage from "./modules/farmer/FarmerResetPasswordPage";
import FarmerSignupPage from "./modules/farmer/FarmerSignupPage";
import FinancingModule from "./modules/farmer/FinancingModule";
import MarketIntelligenceModule from "./modules/farmer/MarketIntelligenceModule";
import MyFarmModule from "./modules/farmer/MyFarmModule";
import SellSmartModule from "./modules/farmer/SellSmartModule";
import SplashScreen from "./modules/farmer/SplashScreen";
import ListToolPage from "./modules/farmer/ListToolPage";
import ToolDetailPage from "./modules/farmer/ToolDetailPage";
import ToolsServicesModule from "./modules/farmer/ToolsServicesModule";
import WeatherModule from "./modules/farmer/WeatherModule";
import AccessRestricted from "./components/AccessRestricted";
import AssistantDock from "./assistant/AssistantDock";
import { getFarmerPageMeta } from "./components/farmer/farmerNav";
import { loadFarmCrops } from "./farm/cropStorage";
import { usePushRegistration } from "./lib/usePushRegistration";
import CoachTour from "./components/CoachTour";
import { FARMER_TOUR_STEPS, markTourSeen, shouldShowTour } from "./components/farmerTour";
import { getStoredUser } from "./auth/session";
import {
  canAccessAdminAnalytics,
  canAccessFarmer,
  canAccessResearch,
} from "./auth/access";
import { FINANCING_ENABLED, RESEARCH_WORKSPACE_ENABLED } from "./config/features";
import CropSetupPage from "./onboarding/CropSetupPage";
import OnboardingFlow from "./onboarding/OnboardingFlow";
import SettingsPage from "./settings/SettingsPage";

// Dev-only workspace. `import.meta.env.DEV` is written inline rather than read
// from config/features so the bundler sees a literal `false` here and drops the
// dynamic import: in production no research chunk is emitted at all.
const ResearchApp = import.meta.env.DEV
  ? lazy(() => import("./research/ResearchApp"))
  : null;

function FarmerProtectedRoute() {
  const user = getStoredUser();
  const location = useLocation();

  if (!canAccessFarmer(user)) {
    return <AccessRestricted />;
  }

  // Every farmer feature is matched on crop, so an account without one is sent
  // to crop setup before any farmer page renders. This also catches accounts
  // created before crops were collected.
  if (!loadFarmCrops().length && location.pathname !== "/setup-crops") {
    return <Navigate to="/setup-crops" replace />;
  }

  // The dock is mounted here rather than inside AppShell: this wrapper survives
  // navigation between farmer pages, so the panel stays open and an in-flight
  // answer keeps streaming instead of being remounted and aborted.
  const page = getFarmerPageMeta(location.pathname);


  // Crop setup is a chrome-free step: the assistant would both overlap the crop
  // grid and offer to answer questions about a farm with no crops recorded yet.
  const showAssistant = location.pathname !== "/setup-crops";

  return (
    <>
      <Outlet />
      {showAssistant ? <AssistantDock page={page.key} pageLabel={page.label} /> : null}
      {/* Only on the dashboard: that is where the tour's first target lives, and
          it is the first page a new account lands on once crops are recorded. */}
      {location.pathname === "/dashboard" ? <FirstRunTour /> : null}
    </>
  );
}

/** Shows the guided tour once, on the first visit to the dashboard.
 *
 *  The decision is read once into state rather than on every render, so
 *  dismissing it does not have the component change its mind mid-animation.
 */
function FirstRunTour() {
  const [open, setOpen] = useState(() => shouldShowTour());

  if (!open) return null;

  return (
    <CoachTour
      steps={FARMER_TOUR_STEPS}
      onFinish={() => {
        markTourSeen();
        setOpen(false);
      }}
    />
  );
}

function RootRedirect() {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/onboarding" replace />;
  }

  if (canAccessFarmer(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (RESEARCH_WORKSPACE_ENABLED) {
    if (canAccessAdminAnalytics(user)) {
      return <Navigate to="/research/admin" replace />;
    }

    if (canAccessResearch(user)) {
      return <Navigate to="/research" replace />;
    }
  }

  return <AccessRestricted />;
}

export default function App() {
  // Mounted once, inside the router: a tapped notification needs somewhere to
  // navigate to.
  usePushRegistration();

  return (
    <Routes>
      <Route path="/login" element={<FarmerLoginPage />} />
      <Route path="/onboarding" element={<OnboardingFlow />} />
      <Route path="/signup" element={<FarmerSignupPage />} />
      <Route path="/forgot-password" element={<FarmerForgotPasswordPage />} />
      <Route path="/verify-otp" element={<FarmerOtpVerificationPage />} />
      <Route path="/reset-password" element={<FarmerResetPasswordPage />} />
      <Route path="/splash" element={<SplashScreen />} />
      <Route path="/" element={<RootRedirect />} />
      <Route element={<FarmerProtectedRoute />}>
        <Route path="/setup-crops" element={<CropSetupPage />} />
        <Route path="/dashboard" element={<DashboardModule />} />
        <Route path="/my-farm" element={<MyFarmModule />} />
        <Route path="/market-intelligence" element={<MarketIntelligenceModule />} />
        <Route path="/sell-smart" element={<SellSmartModule />} />
        <Route path="/find-buyers" element={<FindBuyersModule />} />
        <Route path="/buyers" element={<Navigate to="/find-buyers" replace />} />
        <Route path="/weather" element={<WeatherModule />} />
        <Route path="/alerts" element={<AlertsModule />} />
        <Route path="/tools-services" element={<ToolsServicesModule />} />
        {/* `list` is matched before `:toolId` so it is not read as an id. */}
        <Route path="/tools-services/list" element={<ListToolPage />} />
        <Route path="/tools-services/:toolId" element={<ToolDetailPage />} />
        <Route
          path="/financing"
          element={
            FINANCING_ENABLED ? <FinancingModule /> : <Navigate to="/dashboard" replace />
          }
        />
        <Route path="/settings" element={<SettingsPage workspace="farmer" />} />
        <Route path="/settings/:panel" element={<SettingsPage workspace="farmer" />} />
      </Route>
      {ResearchApp ? (
        <Route
          path="/research/*"
          element={
            <Suspense fallback={null}>
              <ResearchApp />
            </Suspense>
          }
        />
      ) : null}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
