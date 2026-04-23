import React from "react";
import {
  AppShell,
  Card,
  MobileCard,
  SectionTitle,
} from "../../components/farmer/FarmerShared";
import { recentAlerts } from "../../data/farmerDashboardData";

function AlertRow({ item }) {
  const Icon = item.icon;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#EEF2EC] px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2F7EF]">
          <Icon className="h-5 w-5 text-[#2F8F46]" />
        </div>
        <span className="text-[15px] text-[#263026]">{item.title}</span>
      </div>
      <span className="text-sm text-[#6A7468]">{item.time}</span>
    </div>
  );
}

function DesktopContent() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <Card>
          <SectionTitle action="Mark all seen">Recent Alerts</SectionTitle>
          <div className="space-y-4">
            {recentAlerts.map((item) => (
              <AlertRow key={item.id} item={item} />
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
      {recentAlerts.map((item) => {
        const Icon = item.icon;
        return (
          <MobileCard key={item.id}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F2F7EF]">
                  <Icon className="h-5 w-5 text-[#2F8F46]" />
                </div>
                <p className="text-sm text-[#263026]">{item.title}</p>
              </div>
              <span className="text-xs text-[#6A7468]">{item.time}</span>
            </div>
          </MobileCard>
        );
      })}
    </div>
  );
}

export default function AlertsModule() {
  return (
    <AppShell
      current="alerts"
      title="Alerts"
      subtitle="Recent Notifications"
      mobileSubtitle="Module"
      desktopContent={<DesktopContent />}
      mobileContent={<MobileContent />}
    />
  );
}
