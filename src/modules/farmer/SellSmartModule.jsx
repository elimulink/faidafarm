import React from "react";
import {
  ActionButton,
  AppShell,
  Card,
  MobileCard,
  SectionTitle,
} from "../../components/farmer/FarmerShared";

function DesktopContent() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-7">
        <Card className="bg-[#F4F8F1]">
          <SectionTitle>Recommendation</SectionTitle>
          <div className="inline-flex rounded-full bg-[#E3F0DE] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#2F7C33]">
            AI Recommendation
          </div>
          <h2 className="mt-5 text-[50px] font-bold leading-[1.02] text-[#111711]">
            Wait 10 days
            <br />
            before selling
          </h2>
          <p className="mt-5 max-w-[520px] text-lg leading-8 text-[#4B574C]">
            Prices are rising and demand is increasing in your region.
          </p>
          <div className="mt-6 grid max-w-[420px] grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-sm text-[#667164]">If sold today</p>
              <p className="mt-2 text-2xl font-bold text-[#111711]">KES 80/kg</p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-sm text-[#667164]">If sold later</p>
              <p className="mt-2 text-2xl font-bold text-[#2F8F46]">KES 92/kg</p>
            </div>
          </div>
          <div className="mt-6">
            <ActionButton to="/buyers">View Detailed Analysis</ActionButton>
          </div>
        </Card>
      </div>

      <div className="col-span-12 xl:col-span-5">
        <Card>
          <SectionTitle>Why this action</SectionTitle>
          <div className="space-y-4">
            {[
              "Recent 7-day price increase detected",
              "Buyer demand in Nairobi is improving",
              "Current market signals favor short wait",
              "Weather risk is manageable for now",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-[#EEF2EC] px-4 py-4 text-[#2A332A]">
                {item}
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
      <MobileCard className="bg-[#F4F8F1]">
        <div className="inline-flex rounded-full bg-[#E3F0DE] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2F7C33]">
          AI Recommendation
        </div>
        <h2 className="mt-4 text-[34px] font-bold leading-tight text-[#111711]">
          Wait 10 days
          <br />
          before selling
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-[#4B574C]">
          Prices are rising and demand is increasing in your region.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs text-[#667164]">Today</p>
            <p className="mt-2 text-xl font-bold text-[#111711]">KES 80/kg</p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs text-[#667164]">Later</p>
            <p className="mt-2 text-xl font-bold text-[#2F8F46]">KES 92/kg</p>
          </div>
        </div>
      </MobileCard>

      <MobileCard>
        <h3 className="text-lg font-semibold text-[#1F2B1F]">Why this action</h3>
        <div className="mt-4 space-y-3">
          {[
            "7-day price increase",
            "Higher demand in Nairobi",
            "Short wait gives better returns",
            "Weather still manageable",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-[#EEF2EC] px-4 py-3 text-sm text-[#2A332A]">
              {item}
            </div>
          ))}
        </div>
      </MobileCard>
    </div>
  );
}

export default function SellSmartModule() {
  return (
    <AppShell
      current="sell-smart"
      title="Sell Smart"
      subtitle="Kitui, Kenya"
      mobileSubtitle="Module"
      desktopContent={<DesktopContent />}
      mobileContent={<MobileContent />}
    />
  );
}
