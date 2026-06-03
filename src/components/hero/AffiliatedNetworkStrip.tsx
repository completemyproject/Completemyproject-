const PARTNERS = Array.from({ length: 8 }, (_, i) => ({ name: `Coming Soon ${i + 1}` }));

export default function AffiliatedNetworkStrip() {
  const loop = [...PARTNERS, ...PARTNERS];
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

        <div className="marquee-pause relative overflow-hidden py-2 sm:py-3">
          {/* Edge fades */}
          <div aria-hidden className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-warm-100 to-transparent z-10" />
          <div aria-hidden className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-warm-100 to-transparent z-10" />

          <div className="marquee-track flex flex-nowrap items-center gap-8 sm:gap-20 w-max">
            {loop.map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="flex items-center justify-center shrink-0 h-14 w-28 sm:h-20 sm:w-40 lg:h-24 lg:w-48 rounded-xl border border-warm-200 bg-white"
              >
                <span className="text-sm sm:text-base font-semibold text-oak-600 tracking-tight">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}