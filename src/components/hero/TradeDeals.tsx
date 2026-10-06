import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import evChargerDeal from "@/assets/trade-deals/ev-charger.jpg";
import houseRewireDeal from "@/assets/trade-deals/house-rewire.jpg";
import suspendedCeilingsDeal from "@/assets/trade-deals/suspended-ceilings.jpg";

// Each image is a complete card design (header, offer, checklist and CTA), cropped to an identical 440×780.
const TRADE_DEALS = [
  {
    title: "Suspended Ceilings",
    image: suspendedCeilingsDeal,
    alt: "Discounts on suspended ceilings. Save with our special! High-quality workmanship. Clean, professional service from start to finish. Receive a free consultation.",
  },
  {
    title: "EV Charger Installation",
    image: evChargerDeal,
    alt: "Need an EV charger installed? Installed within 14 days or £100 off. Fully qualified electricians. Safe, compliant installation. Receive a free consultation.",
  },
  {
    title: "Full House Rewire",
    image: houseRewireDeal,
    alt: "Need a full house rewire? Save up to 15%. Fully qualified and insured. Minimal disruption to your home. Receive a free consultation.",
  },
];

export default function TradeDeals() {
  return (
    <section
      aria-labelledby="trade-deals-heading"
      className="py-14 sm:py-20 lg:py-24 bg-warm-50 border-y border-warm-200"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-oak-600 mb-3">Limited time offers</p>
          <h2
            id="trade-deals-heading"
            className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4"
          >
            Trade Deals
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Exclusive savings from our vetted multi-trade companies — every deal includes a free consultation.
          </p>
        </div>

        <ul className="grid grid-cols-3 gap-1.5 sm:gap-6 -mx-2 sm:mx-auto sm:max-w-2xl">
          {TRADE_DEALS.map((deal) => (
            <li key={deal.title}>
              <Link
                to="/get-quotes"
                title={deal.title}
                className="block rounded-2xl transition-transform duration-300 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <img
                  src={deal.image}
                  alt={deal.alt}
                  width={440}
                  height={780}
                  loading="lazy"
                  className="w-full h-auto"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 sm:mt-12 text-center">
          <Link
            to="/get-quotes"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-soft transition-colors hover:bg-accent/90"
          >
            Claim your free consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
