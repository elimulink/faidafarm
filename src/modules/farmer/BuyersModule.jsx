import React from "react";
import {
  AppShell,
  Card,
  MobileCard,
  SectionTitle,
} from "../../components/farmer/FarmerShared";
import { buyers } from "../../data/farmerDashboardData";

function BuyerCard({ buyer }) {
  return (
    <div className="rounded-[24px] border border-[#EEF2EC] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-xl font-bold text-[#182118]">{buyer.name}</h4>
          <p className="mt-1 text-sm text-[#667164]">{buyer.location}</p>
        </div>
        <span className="rounded-full bg-[#EEF7E8] px-3 py-1 text-xs font-semibold text-[#2F8F46]">
          {buyer.reliability}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-[#F7F9F6] p-4">
          <p className="text-sm text-[#667164]">Offer</p>
          <p className="mt-2 text-lg font-semibold text-[#182118]">{buyer.offer}</p>
        </div>
        <div className="rounded-2xl bg-[#F7F9F6] p-4">
          <p className="text-sm text-[#667164]">Demand</p>
          <p className="mt-2 text-lg font-semibold text-[#2F8F46]">{buyer.demand}</p>
        </div>
      </div>
      <button className="mt-5 rounded-2xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white">
        Contact Buyer
      </button>
    </div>
  );
}

function DesktopContent() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <Card>
          <SectionTitle>Matched Buyers</SectionTitle>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            {buyers.map((buyer) => (
              <BuyerCard key={buyer.id} buyer={buyer} />
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
      {buyers.map((buyer) => (
        <MobileCard key={buyer.id}>
          <h3 className="text-lg font-bold text-[#182118]">{buyer.name}</h3>
          <p className="mt-1 text-sm text-[#667164]">{buyer.location}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#F7F9F6] p-3">
              <p className="text-xs text-[#667164]">Offer</p>
              <p className="mt-2 font-semibold text-[#182118]">{buyer.offer}</p>
            </div>
            <div className="rounded-2xl bg-[#F7F9F6] p-3">
              <p className="text-xs text-[#667164]">Demand</p>
              <p className="mt-2 font-semibold text-[#2F8F46]">{buyer.demand}</p>
            </div>
          </div>
          <button className="mt-4 rounded-2xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white">
            Contact Buyer
          </button>
        </MobileCard>
      ))}
    </div>
  );
}

export default function BuyersModule() {
  return (
    <AppShell
      current="buyers"
      title="Buyers"
      subtitle="Matched Buyers Near You"
      mobileSubtitle="Module"
      desktopContent={<DesktopContent />}
      mobileContent={<MobileContent />}
    />
  );
}
