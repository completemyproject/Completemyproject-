import { useState } from "react";
import { ShieldCheck, Umbrella, RefreshCw } from "lucide-react";
import heroPromo from "@/assets/hero-phone-promo.png";
import { QUICK_SEARCH_CHIPS } from "@/data/services";
import { HeroSearchBox } from "@/components/hero/HeroSearchBox";

type HeroTopProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  onQuickChip: (chip: string) => void;
};

export default function HeroTop({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onQuickChip,
}: HeroTopProps) {
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative bg-warm-50 overflow-x-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24"
    >
      <div aria-hidden className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
      <div aria-hidden className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-oak/10 blur-3xl" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center bg-warm-100 border border-warm-200 rounded-full px-3 py-1.5 mb-6 animate-fade-up">
              <span className="text-xs font-semibold text-foreground tracking-tight">Fully vetted UK companies</span>
            </div>

            <h1
              id="hero-heading"
              className="font-display text-[2.25rem] xs:text-[2.5rem] sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] text-ink-900 mb-6 animate-fade-up tracking-[-0.03em]"
            >
              One Project.<br />
              One Price.<br />
              <span className="text-oak-600">Zero Stress.</span>
            </h1>

            <p
              className="text-lg sm:text-xl text-foreground/75 leading-relaxed mb-8 animate-fade-up max-w-xl"
              style={{ animationDelay: "0.1s" }}
            >
              Get matched with a fully vetted company that manages your entire project,
              from start to finish one fixed price, one point of contact.
            </p>

            <HeroSearchBox
              value={searchQuery}
              onChange={onSearchQueryChange}
              onSearch={onSearch}
              onPickSuggestion={onQuickChip}
              onOpenChange={setSuggestionsOpen}
            />

            <div
              className={`mt-5 flex flex-wrap gap-2 animate-fade-up transition-opacity ${
                suggestionsOpen ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
              style={{ animationDelay: "0.18s" }}
              aria-hidden={suggestionsOpen}
            >
              {QUICK_SEARCH_CHIPS.map((c) => {
                const active = searchQuery.toLowerCase() === c.toLowerCase();
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onQuickChip(c)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      active
                        ? "bg-oak-500/10 border-oak-500 text-oak-600"
                        : "bg-card border-warm-200 hover:border-oak-500 hover:text-oak-600 text-foreground/70"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            <div
              className={`mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs sm:text-sm font-semibold text-foreground/75 animate-fade-up transition-opacity ${
                suggestionsOpen ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
              style={{ animationDelay: "0.2s" }}
              aria-hidden={suggestionsOpen}
            >
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-oak-600" />
                DBS checked
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Umbrella className="w-4 h-4 text-oak-600" />
                Insured
              </span>
              <span className="inline-flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-oak-600" />
                Re-verified yearly
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative animate-fade-up" style={{ animationDelay: "0.25s" }}>
            <div className="relative mx-auto max-w-[12.65rem] sm:max-w-[14.95rem]">
              <div className="relative rounded-[2rem] overflow-hidden">
                <img
                  src={heroPromo}
                  alt="Stop juggling quotes — no more chasing tradesmen, fully vetted companies via CompleteMyProject.co.uk"
                  className="w-full h-auto object-contain"
                  width={688}
                  height={1530}
                  loading="eager"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-row flex-nowrap justify-center gap-2 sm:gap-3 max-w-[20rem] mx-auto">
              <a
                href="#"
                aria-label="Download on the App Store"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-ink-900 text-warm-50 rounded-xl px-3 py-2.5 hover:-translate-y-0.5 hover:shadow-lifted transition-all shadow-soft"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0 fill-current" aria-hidden>
                  <path d="M16.365 1.43c0 1.14-.42 2.22-1.12 3.02-.74.86-1.95 1.52-3.04 1.45-.13-1.11.42-2.27 1.1-3.02.78-.85 2.07-1.5 3.06-1.45zM20.5 17.32c-.55 1.27-.82 1.84-1.53 2.96-1 1.57-2.4 3.53-4.13 3.55-1.54.02-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.99-1.74-.02-3.07-1.79-4.07-3.36C-.27 16.4-.6 11.32 1.6 8.6c1.55-1.94 4-3.07 6.3-3.07 2.34 0 3.81 1.28 5.74 1.28 1.88 0 3.02-1.28 5.72-1.28 2.04 0 4.21 1.11 5.76 3.03-5.06 2.77-4.24 10.01-4.62 8.76z"/>
                </svg>
                <span className="flex flex-col leading-tight text-left">
                  <span className="text-[8px] uppercase tracking-wider opacity-75">Download on the</span>
                  <span className="text-xs font-display font-bold">App Store</span>
                </span>
              </a>
              <a
                href="#"
                aria-label="Get it on Google Play"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-ink-900 text-warm-50 rounded-xl px-3 py-2.5 hover:-translate-y-0.5 hover:shadow-lifted transition-all shadow-soft"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden>
                  <path fill="#34A853" d="M3.6 2.3 16.8 15.5l3.5-3.5L4.5 1.9c-.3-.1-.6-.1-.9.4z"/>
                  <path fill="#FBBC04" d="m20.3 12-3.5-3.5-3.6 3.5 3.6 3.5L20.3 12z"/>
                  <path fill="#EA4335" d="M3.6 21.7c.3.5.6.5.9.4l15.8-10.1-3.5-3.5L3.6 21.7z"/>
                  <path fill="#4285F4" d="M3.6 2.3C3.2 2.7 3 3.3 3 4.1v15.8c0 .8.2 1.4.6 1.8L16.8 12 3.6 2.3z"/>
                </svg>
                <span className="flex flex-col leading-tight text-left">
                  <span className="text-[8px] uppercase tracking-wider opacity-75">Get it on</span>
                  <span className="text-xs font-display font-bold">Google Play</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
