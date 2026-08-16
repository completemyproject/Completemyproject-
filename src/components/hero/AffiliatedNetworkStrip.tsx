import { AFFILIATES } from "@/data/affiliates";

// Duplicate the list so the marquee track can loop seamlessly (animation translates it -50%).
const MARQUEE_ITEMS = [...AFFILIATES, ...AFFILIATES];

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

        {/* Mobile: static 3-per-row grid; a lone item on the final row is centred. */}
        <div className="grid grid-cols-3 gap-2.5 sm:hidden">
          {AFFILIATES.map((affiliate, i) => {
            const isLoneOnLastRow = i === AFFILIATES.length - 1 && AFFILIATES.length % 3 === 1;
            return (
              <a
                key={affiliate.name}
                href={affiliate.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                title={affiliate.name}
                className={`flex items-center justify-center h-20 rounded-xl border border-warm-200 bg-white p-2 ${
                  isLoneOnLastRow ? "col-start-2" : ""
                }`}
              >
                <img
                  src={affiliate.logo}
                  alt={affiliate.name}
                  className="max-h-full max-w-full object-contain"
                />
              </a>
            );
          })}
        </div>

        {/* sm+: auto-scrolling marquee. */}
        <div className="group relative hidden sm:block overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] motion-reduce:overflow-x-auto">
          <div className="flex w-max items-center animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {MARQUEE_ITEMS.map((affiliate, i) => {
              const isClone = i >= AFFILIATES.length;
              return (
                <a
                  key={`${affiliate.name}-${i}`}
                  href={affiliate.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  title={affiliate.name}
                  aria-hidden={isClone || undefined}
                  tabIndex={isClone ? -1 : undefined}
                  className="flex items-center justify-center shrink-0 mr-3 sm:mr-6 lg:mr-8 h-20 w-36 sm:h-16 sm:w-32 lg:h-24 lg:w-[200px] rounded-xl border border-warm-200 bg-white p-2.5"
                >
                  <img
                    src={affiliate.logo}
                    alt={affiliate.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
