// What a farmer sees after tapping Explore: the equipment, what it costs, what
// it actually does, and who is offering it.

import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  MessageCircle,
  Phone,
  ShieldAlert,
  Star,
  Wrench,
} from "lucide-react";
import { AppShell, Card, MobileCard } from "../../components/farmer/FarmerShared";
import { formatPrice, getListing } from "../../data/toolsData";

function NotFound() {
  return (
    <div className="rounded-[24px] border border-dashed border-[#D8E2D4] bg-[#FAFCF9] px-6 py-12 text-center">
      <Wrench className="mx-auto h-8 w-8 text-[#2F8F46]" />
      <h3 className="mt-3 text-lg font-bold text-[#182118]">That listing is not available</h3>
      <p className="mt-1 text-sm text-[#667164]">It may have been withdrawn by the supplier.</p>
      <Link
        to="/tools-services"
        className="mt-5 inline-flex rounded-2xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white"
      >
        Back to tools
      </Link>
    </div>
  );
}

function SellerCard({ seller, listingName }) {
  const message = encodeURIComponent(
    `Hello ${seller.name}, I saw your ${listingName} on FaidaFarm. Is it available?`
  );
  const whatsappNumber = seller.phone.replace(/[^0-9]/g, "");

  return (
    <div className="rounded-[22px] border border-[#EEF2EC] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8A958A]">
            Offered by
          </p>
          <p className="mt-1 truncate text-[16px] font-bold text-[#182118]">{seller.name}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-[#667164]">
            <MapPin className="h-3.5 w-3.5" />
            {seller.county} · on FaidaFarm since {seller.since}
          </p>
        </div>

        {seller.verified ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#EEF7E8] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-[#2F8F46]">
            <BadgeCheck size={12} />
            Verified
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#FDF8EE] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-[#B77A18]">
            <ShieldAlert size={12} />
            Unverified
          </span>
        )}
      </div>

      {!seller.verified ? (
        <p className="mt-3 rounded-2xl bg-[#FDF8EE] px-3 py-2.5 text-xs leading-5 text-[#7A5510]">
          We have not confirmed this supplier yet. Inspect the equipment and agree terms in
          person before paying anything.
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={`tel:${seller.phone}`}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white"
        >
          <Phone className="h-4 w-4" />
          Call
        </a>
        <a
          href={`https://wa.me/${whatsappNumber}?text=${message}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl border border-[#CFE3C8] bg-white px-4 py-3 text-sm font-semibold text-[#166534]"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}

function DetailBody({ item, compact = false }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => navigate("/tools-services")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#166534]"
      >
        <ArrowLeft className="h-4 w-4" />
        All tools
      </button>

      <div className="overflow-hidden rounded-[24px] border border-[#EEF2EC] bg-white">
        <div className={`w-full bg-[#F1F6EE] ${compact ? "aspect-[4/3]" : "aspect-[16/9]"}`}>
          {item.image ? (
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Wrench className="h-12 w-12 text-[#2F8F46]" />
            </div>
          )}
        </div>

        <div className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8A958A]">
            {item.brand}
          </p>
          <h1 className={`mt-1 font-bold leading-tight text-[#182118] ${compact ? "text-[24px]" : "text-[30px]"}`}>
            {item.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="text-xl font-bold text-[#166534]">{formatPrice(item.price)}</span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#667164]">
              <Star className="h-4 w-4 fill-[#E8B93B] text-[#E8B93B]" />
              {item.rating} ({item.reviews} reviews)
            </span>
          </div>

          <p className="mt-4 text-[15.5px] leading-7 text-[#3F4A40]">{item.description}</p>

          <h2 className="mt-6 text-sm font-bold uppercase tracking-wide text-[#8A958A]">
            Details
          </h2>
          <dl className="mt-2 divide-y divide-[#F0F3EE]">
            {item.specs.map(([key, value]) => (
              <div key={key} className="flex items-start justify-between gap-4 py-2.5">
                <dt className="text-sm text-[#667164]">{key}</dt>
                <dd className="text-right text-sm font-semibold text-[#182118]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <SellerCard seller={item.seller} listingName={item.name} />

      <p className="text-[11px] leading-4 text-[#A0AA9E]">
        Sample listing. FaidaFarm does not handle payment - agree terms directly with the
        supplier.
      </p>
    </div>
  );
}

export default function ToolDetailPage() {
  const { toolId } = useParams();
  const item = getListing(toolId);

  const desktop = item ? (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-9 xl:col-start-2">
        <Card>
          <DetailBody item={item} />
        </Card>
      </div>
    </div>
  ) : (
    <NotFound />
  );

  const mobile = item ? (
    <DetailBody item={item} compact />
  ) : (
    <MobileCard>
      <NotFound />
    </MobileCard>
  );

  return (
    <AppShell
      current="tools-services"
      title={item ? item.name : "Tool"}
      subtitle="Tools & Services"
      mobileSubtitle="Tools"
      desktopContent={desktop}
      mobileContent={mobile}
    />
  );
}
