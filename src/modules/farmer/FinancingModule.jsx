import React from "react";
import {
  AppShell,
  Card,
  MobileCard,
  SectionTitle,
} from "../../components/farmer/FarmerShared";
import { financingCards } from "../../data/farmerDashboardData";

function DesktopContent() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <Card>
          <SectionTitle>Financing Options</SectionTitle>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {financingCards.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="rounded-[24px] border border-[#EEF2EC] p-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F6EE]">
                    <Icon className="h-7 w-7 text-[#2F8F46]" />
                  </div>
                  <h4 className="mt-5 text-xl font-bold text-[#182118]">{item.title}</h4>
                  <p className="mt-3 text-[#616A5F]">{item.desc}</p>
                  <button className="mt-5 rounded-2xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white">
                    Apply Interest
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function MobileContent() {
  return (
    <div className="space-y-4">
      {financingCards.map((item) => {
        const Icon = item.icon;
        return (
          <MobileCard key={item.id}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F6EE]">
              <Icon className="h-6 w-6 text-[#2F8F46]" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#182118]">{item.title}</h3>
            <p className="mt-2 text-sm text-[#616A5F]">{item.desc}</p>
            <button className="mt-4 rounded-2xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white">
              Apply Interest
            </button>
          </MobileCard>
        );
      })}
    </div>
  );
}

export default function FinancingModule() {
  return (
    <AppShell
      current="financing"
      title="Financing"
      subtitle="Loans and Partner Support"
      mobileSubtitle="Module"
      desktopContent={<DesktopContent />}
      mobileContent={<MobileContent />}
    />
  );
}
