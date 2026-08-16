import { ShieldCheck, FileCheck2, Umbrella, Images } from "lucide-react";

const VETTING_ITEMS = [
  {
    label: "DBS checks",
    Icon: ShieldCheck,
    desc: "Each director of the multi-trade company is screened through the Disclosure and Barring Service for your safety.",
  },
  {
    label: "3 references",
    Icon: FileCheck2,
    desc: "We verify a minimum of three recent client references before any company joins our panel.",
  },
  {
    label: "Public liability insurance",
    Icon: Umbrella,
    desc: "All companies hold valid public liability cover, fully checked and renewed annually.",
  },
  {
    label: "3 before and after",
    Icon: Images,
    desc: "We require three before and after or after images of completed jobs carried out by the multi-trade company.",
  },
];

export default function TrustVetting() {
  return (
    <section aria-labelledby="vetting-heading" className="bg-warm-50 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-oak-600 mb-3">Trust by design</p>
          <h2 id="vetting-heading" className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
            What's Included In Our Vetting
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            We don't just do a one-off check, every company is re-verified annually
            to ensure they continue to meet our high standards.
          </p>
        </div>

        {/* Credential strip */}
        <div className="rounded-2xl bg-card border border-warm-200 shadow-soft overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-warm-200">
            {VETTING_ITEMS.map(({ label, Icon, desc }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2.5 px-4 sm:px-5 py-6 sm:py-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-oak-500 to-oak-600 text-white shadow-soft ring-4 ring-oak-500/15 flex items-center justify-center">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.25} aria-hidden />
                </div>
                <span className="text-sm sm:text-base font-bold text-foreground tracking-tight">{label}</span>
                <p className="text-xs sm:text-sm text-muted-foreground leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-base text-muted-foreground leading-relaxed">
          We check the company's history and records.
        </p>
      </div>
    </section>
  );
}