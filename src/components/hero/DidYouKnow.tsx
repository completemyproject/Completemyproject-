import { TrendingDown, AlertTriangle, Users, ShieldAlert } from "lucide-react";

const FEATURED = {
  stat: "£1.4bn",
  label: "Annual loss",
  desc: "lost by UK homeowners every year to rogue traders and unfinished work.",
  Icon: TrendingDown,
};

const STATS = [
  {
    stat: "1 in 7",
    label: "Complaints",
    desc: "of all trade complaints (14%) involve scams or rogue traders.",
    Icon: AlertTriangle,
  },
  {
    stat: "18%",
    label: "UK adults affected",
    desc: "have personally been victims of rogue tradespeople.",
    Icon: ShieldAlert,
  },
  {
    stat: "775,000",
    label: "Households / year",
    desc: "are impacted by poor or fraudulent trade work annually.",
    Icon: Users,
  },
];

export default function DidYouKnow() {
  return (
    <section aria-labelledby="did-you-know-heading" className="py-16 sm:py-20 lg:py-28 bg-warm-100 border-y border-warm-200 relative overflow-hidden">
      {/* Decorative background */}
      <div aria-hidden className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--ink-900)) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-card border border-warm-200 rounded-full px-3.5 py-1.5 mb-5 shadow-soft">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground">The reality</span>
          </div>
          <h2
            id="did-you-know-heading"
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4"
          >
            Did you know?
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            The UK home renovation market has a trust problem. Here's why a vetted network matters.
          </p>
        </div>

        {/* Featured hero stat */}
        <div className="relative mb-8 rounded-3xl bg-gradient-to-br from-ink-900 to-ink-900/95 p-8 sm:p-12 lg:p-14 shadow-lifted overflow-hidden">
          <div aria-hidden className="absolute -top-20 -right-16 w-80 h-80 rounded-full bg-accent/15 blur-3xl" />
          <div aria-hidden className="absolute -bottom-20 -left-16 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative grid md:grid-cols-[auto,1fr] gap-8 md:gap-12 items-center">
            <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-accent/15 border border-accent/30 shrink-0">
              <FEATURED.Icon className="w-10 h-10 sm:w-12 sm:h-12 text-accent" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="text-warm-50">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-3">{FEATURED.label}</p>
              <p className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-none mb-4">
                {FEATURED.stat}
              </p>
              <p className="text-base sm:text-lg text-warm-50/80 leading-relaxed max-w-xl">
                {FEATURED.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Supporting stats grid */}
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {STATS.map(({ stat, label, desc, Icon }) => (
            <article
              key={stat}
              className="group relative rounded-2xl bg-card border border-warm-200 p-6 sm:p-7 shadow-soft hover:shadow-lifted hover:border-accent/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-warm-100 border border-warm-200 flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/30 transition-colors">
                  <Icon className="w-5 h-5 text-oak-600" aria-hidden />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{label}</span>
              </div>
              <p className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-[-0.02em] leading-none mb-3">
                {stat}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}