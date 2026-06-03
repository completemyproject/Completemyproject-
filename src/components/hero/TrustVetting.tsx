import { ShieldCheck, FileCheck2, Umbrella, Sparkles } from "lucide-react";

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
    label: "And much more",
    Icon: Sparkles,
    desc: "Company history and records, including high-quality images of completed work.",
  },
];

export default function TrustVetting() {
  return (
    <section aria-labelledby="vetting-heading" className="bg-warm-50 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-oak-600 mb-3">Trust by design</p>
          <h2 id="vetting-heading" className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
            What's included in our vetting
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
              <div key={label} className="flex flex-col items-center text-center gap-3 px-5 py-8 sm:py-10">
                <div className="w-12 h-12 rounded-full bg-warm-100 border border-warm-200 flex items-center justify-center">
                  <Icon className="w-5.5 h-5.5 text-oak-600" aria-hidden />
                </div>
                <span className="text-sm font-bold text-foreground tracking-tight">{label}</span>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[18ch]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}