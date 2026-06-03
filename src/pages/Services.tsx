import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, ShieldCheck, Clock, PoundSterling } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  SERVICES,
  SERVICE_CATEGORIES,
  filterServices,
  type ServiceCategoryFilter,
} from "@/data/services";

const PROCESS = [
  { step: "01", title: "Tell us your project", desc: "Quick form — under two minutes." },
  { step: "02", title: "Get matched", desc: "Up to three vetted multi-trade companies." },
  { step: "03", title: "One fixed quote", desc: "Single price, single point of contact." },
];

export default function Services() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<ServiceCategoryFilter>("All");

  const filtered = filterServices(SERVICES, search, active);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-warm-50 overflow-hidden">
        <div aria-hidden className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        <div aria-hidden className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-oak/10 blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-4">Our services</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-ink-900 mb-5 leading-[1.05]">
            Every trade. <span className="text-oak-600">One company.</span>
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed mb-8">
            From kitchens to rooftops — get matched with a vetted multi-trade company that handles your whole project.
          </p>

          <div className="max-w-md mx-auto">
            <div className="flex items-center bg-card rounded-full shadow-soft border border-warm-200 overflow-hidden">
              <Search className="w-4 h-4 text-muted-foreground ml-5 shrink-0" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services…"
                className="flex-1 px-3 py-3.5 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card border-y border-warm-200 sticky top-16 z-30 backdrop-blur-md bg-card/90">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  active === cat
                    ? "bg-foreground text-background"
                    : "bg-warm-100 text-foreground/70 hover:bg-warm-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-warm-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No services match your search.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filtered.map((s) => (
                <button
                  key={s.title}
                  onClick={() => navigate(`/get-quotes?projects=${encodeURIComponent(s.title)}`)}
                  className="group text-left bg-card border border-warm-200 rounded-2xl overflow-hidden shadow-soft hover:shadow-lifted hover:-translate-y-1 transition-all"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 inline-flex items-center bg-card/90 backdrop-blur-sm text-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {s.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display text-lg font-bold tracking-tight text-foreground group-hover:text-oak-600 transition-colors">
                        {s.title}
                      </h3>
                      <span className="shrink-0 w-8 h-8 rounded-full bg-warm-100 group-hover:bg-accent flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4 text-foreground/70 group-hover:text-accent-foreground transition-colors" />
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-3">How it works</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-foreground mb-4">
              Three steps. Zero stress.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PROCESS.map((p) => (
              <div key={p.step} className="bg-warm-50 border border-warm-200 rounded-2xl p-7 text-center">
                <p className="font-display text-xs font-extrabold text-oak-600 tracking-[0.25em] mb-3">{p.step}</p>
                <h3 className="font-display text-lg font-bold text-foreground mb-2 tracking-tight">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-warm-50 border-t border-warm-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { Icon: ShieldCheck, title: "Fully vetted", desc: "DBS, insured & re-verified annually." },
              { Icon: PoundSterling, title: "One fixed price", desc: "No hidden costs or scope creep." },
              { Icon: Clock, title: "Fast matches", desc: "Hear back in under 24 hours." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-xl bg-oak-500/10 border border-oak-500/20 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-oak-600" />
                </div>
                <h3 className="font-display font-bold text-foreground tracking-tight">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
