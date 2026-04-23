import React from "react";
import {
  AppShell,
  Card,
  MobileCard,
  SectionTitle,
} from "../../components/farmer/FarmerShared";
import { weatherCards } from "../../data/farmerDashboardData";

function DesktopContent() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-8">
        <Card>
          <SectionTitle>Weather Alerts</SectionTitle>
          <div className="space-y-4">
            {weatherCards.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-[24px] border border-[#DCE7F1] bg-[#F3F7FC] p-5"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E1ECF8]">
                    <Icon className="h-8 w-8 text-[#5383C5]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#1A2225]">{item.title}</h4>
                    <p className="mt-1 text-[#61707B]">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <Card>
          <SectionTitle>Weekly Summary</SectionTitle>
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#EEF2EC] p-4">
              <p className="text-sm text-[#667164]">Rain Probability</p>
              <p className="mt-2 text-3xl font-bold text-[#182118]">64%</p>
            </div>
            <div className="rounded-2xl border border-[#EEF2EC] p-4">
              <p className="text-sm text-[#667164]">Crop Risk</p>
              <p className="mt-2 text-3xl font-bold text-[#2F8F46]">Moderate</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MobileContent() {
  return (
    <div className="space-y-4">
      {weatherCards.map((item) => {
        const Icon = item.icon;
        return (
          <MobileCard key={item.id} className="border-[#DCE7F1] bg-[#F3F7FC]">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E1ECF8]">
                <Icon className="h-6 w-6 text-[#5383C5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1A2225]">{item.title}</h3>
                <p className="mt-1 text-sm text-[#61707B]">{item.desc}</p>
              </div>
            </div>
          </MobileCard>
        );
      })}
    </div>
  );
}

export default function WeatherModule() {
  return (
    <AppShell
      current="weather"
      title="Weather"
      subtitle="Kitui, Kenya Forecast"
      mobileSubtitle="Module"
      desktopContent={<DesktopContent />}
      mobileContent={<MobileContent />}
    />
  );
}
