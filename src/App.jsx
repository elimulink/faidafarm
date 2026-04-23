import { Navigate, Route, Routes } from "react-router-dom";
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

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<FarmerLoginPage />} />
      <Route path="/signup" element={<FarmerSignupPage />} />
      <Route path="/forgot-password" element={<FarmerForgotPasswordPage />} />
      <Route path="/verify-otp" element={<FarmerOtpVerificationPage />} />
      <Route path="/reset-password" element={<FarmerResetPasswordPage />} />
      <Route path="/splash" element={<SplashScreen />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardModule />} />
      <Route path="/my-farm" element={<MyFarmModule />} />
      <Route path="/market-intelligence" element={<MarketIntelligenceModule />} />
      <Route path="/sell-smart" element={<SellSmartModule />} />
      <Route path="/buyers" element={<BuyersModule />} />
      <Route path="/weather" element={<WeatherModule />} />
      <Route path="/alerts" element={<AlertsModule />} />
      <Route path="/tools-services" element={<ToolsServicesModule />} />
      <Route path="/financing" element={<FinancingModule />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
