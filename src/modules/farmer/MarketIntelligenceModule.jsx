import React from "react";
import { TrendingUp } from "lucide-react";
import {
  ActionButton,
  AppShell,
  Card,
  MobileCard,
  SectionTitle,
  SimpleBars,
} from "../../components/farmer/FarmerShared";
import { marketRows } from "../../data/farmerDashboardData";

function DesktopContent() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-8">
        <Card>
          <SectionTitle>Price Forecast</SectionTitle>
          <p className="text-lg text-[#5B6559]">
            Ndengu current price is trending upward in your region.
          </p>
          <div className="mt-5 flex items-center gap-4">
            <div className="text-[48px] font-bold text-[#111711]">KES 80/kg</div>
            <div className="inline-flex items-center gap-1 rounded-full bg-[#EEF7E8] px-3 py-1 text-sm font-semibold text-[#2F8F46]">
              <TrendingUp className="h-4 w-4" /> Rising
            </div>
          </div>
          <SimpleBars />
          <p className="mt-4 font-semibold text-[#2F8F46]">+12% in the last 7 days</p>
          <div className="mt-6">
            <ActionButton to="/sell-smart">Open Full Forecast</ActionButton>
          </div>
        </Card>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <Card>
          <SectionTitle>Market Summary</SectionTitle>
          <div className="space-y-4">
            {marketRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-2xl border border-[#EEF2EC] px-4 py-4"
              >
                <span className="text-[15px] text-[#5F695D]">{row.label}</span>
                <span className="text-[16px] font-semibold text-[#1F2B1F]">{row.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function MobileContent() {
  return (
    <div className="space-y-4">
      <MobileCard>
        <p className="text-sm text-[#667164]">Price Forecast</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="text-[34px] font-bold text-[#111711]">KES 80/kg</div>
          <div className="inline-flex items-center gap-1 rounded-full bg-[#EEF7E8] px-3 py-1 text-xs font-semibold text-[#2F8F46]">
            <TrendingUp className="h-3.5 w-3.5" /> Rising
          </div>
        </div>
        <SimpleBars />
      </MobileCard>

      <MobileCard>
        <h3 className="text-lg font-semibold text-[#1F2B1F]">Market Summary</h3>
        <div className="mt-4 space-y-3">
          {marketRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-2xl border border-[#EEF2EC] px-4 py-3"
            >
              <span className="text-sm text-[#5F695D]">{row.label}</span>
              <span className="font-semibold text-[#1F2B1F]">{row.value}</span>
            </div>
          ))}
        </div>
      </MobileCard>
    </div>
  );
}

export default function MarketIntelligenceModule() {
  return (
    <AppShell
      current="market-intelligence"
      title="Market Intelligence"
      subtitle="Kitui, Kenya"
      mobileSubtitle="Module"
      desktopContent={<DesktopContent />}
      mobileContent={<MobileContent />}
    />
  );
}
