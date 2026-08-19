import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import AlertsModule from "./modules/farmer/AlertsModule";
import BuyersModule from "./modules/farmer/BuyersModule";
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
import ToolsServicesModule from "./modules/farmer/ToolsServicesModule";
import WeatherModule from "./modules/farmer/WeatherModule";
import { getStoredUser } from "./auth/session";
import OnboardingFlow from "./onboarding/OnboardingFlow";
import SettingsPage from "./settings/SettingsPage";
import ResearchShell from "./research/layout/ResearchShell";
import ChildNutrition from "./research/pages/ChildNutrition";
import FieldActivity from "./research/pages/FieldActivity";
import FMNRPlots from "./research/pages/FMNRPlots";
import Households from "./research/pages/Households";
import Reports from "./research/pages/Reports";
import AdminOverview from "./research/pages/admin/AdminOverview";
import ChildDietScores from "./research/pages/admin/ChildDietScores";
import CountyComparison from "./research/pages/admin/CountyComparison";
import Exports from "./research/pages/admin/Exports";
import FMNRMap from "./research/pages/admin/FMNRMap";
import Devices from "./research/pages/field/Devices";
import Drafts from "./research/pages/field/Drafts";
import FieldCollectionHome from "./research/pages/field/FieldCollectionHome";
import FormBuilder from "./research/pages/field/FormBuilder";
import FormPreview from "./research/pages/field/FormPreview";
import FormsLibrary from "./research/pages/field/FormsLibrary";
import Submissions from "./research/pages/field/Submissions";
import SyncQueue from "./research/pages/field/SyncQueue";
import ResearchAccessRestricted from "./research/pages/ResearchAccessRestricted";
import ResearchDashboard from "./research/pages/ResearchDashboard";
import SyncStatus from "./research/pages/SyncStatus";
import {
  canAccessAdminAnalytics,
  canAccessFarmer,
  canAccessResearch,
  canAccessResearchRoute,
} from "./research/researchAccess";

function FarmerProtectedRoute() {
  const user = getStoredUser();

  if (!canAccessFarmer(user)) {
    return <ResearchAccessRestricted />;
  }

  return <Outlet />;
}

function ResearchProtectedRoute() {
  const user = getStoredUser();
  const location = useLocation();

  if (!canAccessResearchRoute(user, location.pathname)) {
    return <ResearchAccessRestricted />;
  }

  return <ResearchShell user={user} />;
}

function AdminProtectedRoute() {
  const user = getStoredUser();

  if (!canAccessAdminAnalytics(user)) {
    return <ResearchAccessRestricted />;
  }

  return <Outlet />;
}

function RootRedirect() {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/onboarding" replace />;
  }

  if (canAccessFarmer(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (canAccessAdminAnalytics(user)) {
    return <Navigate to="/research/admin" replace />;
  }

  if (canAccessResearch(user)) {
    return <Navigate to="/research" replace />;
  }

  return <ResearchAccessRestricted />;
}

export default function App() {
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
        <Route path="/dashboard" element={<DashboardModule />} />
        <Route path="/my-farm" element={<MyFarmModule />} />
        <Route path="/market-intelligence" element={<MarketIntelligenceModule />} />
        <Route path="/sell-smart" element={<SellSmartModule />} />
        <Route path="/buyers" element={<BuyersModule />} />
        <Route path="/weather" element={<WeatherModule />} />
        <Route path="/alerts" element={<AlertsModule />} />
        <Route path="/tools-services" element={<ToolsServicesModule />} />
        <Route path="/financing" element={<FinancingModule />} />
        <Route path="/settings" element={<SettingsPage workspace="farmer" />} />
        <Route path="/settings/:panel" element={<SettingsPage workspace="farmer" />} />
      </Route>
      <Route path="/research" element={<ResearchProtectedRoute />}>
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
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
