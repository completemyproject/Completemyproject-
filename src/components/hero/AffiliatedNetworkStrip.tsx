import { AFFILIATES } from "@/data/affiliates";

export default function AffiliatedNetworkStrip() {
  return (
    <section aria-labelledby="partners-heading" className="py-10 sm:py-16 bg-warm-100 border-y border-warm-200">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-oak-600 mb-2">Trusted suppliers</p>
          <h2
            id="partners-heading"
            className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground"
          >
            Our Affiliated Network
          </h2>
        </div>

        <div className="flex flex-nowrap items-center justify-start sm:justify-center gap-3 sm:gap-6 lg:gap-8 overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 sm:overflow-visible">
          {AFFILIATES.map((affiliate) => (
            <a
              key={affiliate.name}
              href={affiliate.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              title={affiliate.name}
              className="flex items-center justify-center shrink-0 h-14 w-24 sm:h-16 sm:w-32 lg:h-20 lg:w-36 rounded-xl border border-warm-200 bg-white p-2.5"
            >
              <img
                src={affiliate.logo}
                alt={affiliate.name}
                className="max-h-full max-w-full object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
