import React from "react";
import { Sprout } from "lucide-react";
import {
  AppShell,
  Card,
  MobileCard,
  SectionTitle,
} from "../../components/farmer/FarmerShared";
import { farmCrops } from "../../data/farmerDashboardData";

function DesktopContent() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-8">
        <Card>
          <SectionTitle>My Crops</SectionTitle>
          <div className="space-y-4">
            {farmCrops.map((crop) => (
              <div key={crop.id} className="rounded-[24px] border border-[#EEF2EC] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF5EA]">
                      <Sprout className="h-8 w-8 text-[#2F8F46]" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-[#182118]">{crop.name}</h4>
                      <p className="mt-1 text-sm text-[#667164]">{crop.stage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#667164]">Harvest in</p>
                    <p className="text-2xl font-bold text-[#182118]">{crop.harvestIn}</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-[#F7F9F6] p-4">
                    <p className="text-sm text-[#667164]">Acreage</p>
                    <p className="mt-2 text-lg font-semibold text-[#182118]">{crop.acreage}</p>
                  </div>
                  <div className="rounded-2xl bg-[#F7F9F6] p-4">
                    <p className="text-sm text-[#667164]">Expected Yield</p>
                    <p className="mt-2 text-lg font-semibold text-[#182118]">{crop.expectedYield}</p>
                  </div>
                  <div className="rounded-2xl bg-[#F7F9F6] p-4">
                    <p className="text-sm text-[#667164]">Health</p>
                    <p className="mt-2 text-lg font-semibold text-[#2F8F46]">{crop.health}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#E6ECE3]">
                    <div
                      className="h-full rounded-full bg-[#2F8F46]"
                      style={{ width: `${crop.progress}%` }}
                    />
                  </div>
                  <span className="font-semibold text-[#344034]">{crop.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <Card>
          <SectionTitle>Farm Summary</SectionTitle>
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#EEF2EC] p-4">
              <p className="text-sm text-[#667164]">Active Crops</p>
              <p className="mt-2 text-3xl font-bold text-[#182118]">2</p>
            </div>
            <div className="rounded-2xl border border-[#EEF2EC] p-4">
              <p className="text-sm text-[#667164]">Nearest Harvest</p>
              <p className="mt-2 text-3xl font-bold text-[#182118]">12 Days</p>
            </div>
            <div className="rounded-2xl border border-[#EEF2EC] p-4">
              <p className="text-sm text-[#667164]">Farm Status</p>
              <p className="mt-2 text-3xl font-bold text-[#2F8F46]">Stable</p>
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
      {farmCrops.map((crop) => (
        <MobileCard key={crop.id}>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF5EA]">
              <Sprout className="h-7 w-7 text-[#2F8F46]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#182118]">{crop.name}</h3>
              <p className="text-sm text-[#667164]">{crop.stage}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#667164]">Harvest in</p>
              <p className="text-lg font-bold text-[#182118]">{crop.harvestIn}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#E6ECE3]">
              <div
                className="h-full rounded-full bg-[#2F8F46]"
                style={{ width: `${crop.progress}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-[#344034]">{crop.progress}%</span>
          </div>
        </MobileCard>
      ))}
    </div>
  );
}

export default function MyFarmModule() {
  return (
    <AppShell
      current="my-farm"
      title="My Farm"
      subtitle="Kitui, Kenya"
      mobileSubtitle="Module"
      desktopContent={<DesktopContent />}
      mobileContent={<MobileContent />}
    />
  );
}
