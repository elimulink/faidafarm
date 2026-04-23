import React from "react";
import { Droplets, Tractor, Wrench } from "lucide-react";
import {
  AppShell,
  Card,
  MobileCard,
  SectionTitle,
} from "../../components/farmer/FarmerShared";

const tools = [
  {
    id: 1,
    title: "Irrigation Pumps",
    desc: "Recommended for dry-week protection.",
    icon: Droplets,
  },
  {
    id: 2,
    title: "Tractor Services",
    desc: "Access mechanization near your area.",
    icon: Tractor,
  },
  {
    id: 3,
    title: "Farm Equipment",
    desc: "Tools and support matched to your farm needs.",
    icon: Wrench,
  },
];

function ToolCard({ item }) {
  const Icon = item.icon;

  return (
    <div className="rounded-[24px] border border-[#EEF2EC] p-5">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F6EE]">
        <Icon className="h-7 w-7 text-[#2F8F46]" />
      </div>
      <h4 className="mt-5 text-xl font-bold text-[#182118]">{item.title}</h4>
      <p className="mt-3 text-[#616A5F]">{item.desc}</p>
      <button className="mt-5 rounded-2xl border border-[#D7DED4] px-4 py-3 text-sm font-semibold text-[#223022]">
        Explore
      </button>
    </div>
  );
}

function DesktopContent() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <Card>
          <SectionTitle>Tools & Services</SectionTitle>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            {tools.map((item) => (
              <ToolCard key={item.id} item={item} />
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
      {tools.map((item) => {
        const Icon = item.icon;
        return (
          <MobileCard key={item.id}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F6EE]">
              <Icon className="h-6 w-6 text-[#2F8F46]" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#182118]">{item.title}</h3>
            <p className="mt-2 text-sm text-[#616A5F]">{item.desc}</p>
            <button className="mt-4 rounded-2xl border border-[#D7DED4] px-4 py-3 text-sm font-semibold text-[#223022]">
              Explore
            </button>
          </MobileCard>
        );
      })}
    </div>
  );
}

export default function ToolsServicesModule() {
  return (
    <AppShell
      current="tools-services"
      title="Tools & Services"
      subtitle="Support For Smarter Farming"
      mobileSubtitle="Module"
      desktopContent={<DesktopContent />}
      mobileContent={<MobileContent />}
    />
  );
}
