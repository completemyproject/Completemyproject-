import { Star, Quote } from "lucide-react";
import reviewsHeroImg from "@/assets/reviews-hero.jpg";

const reviews = [
  { name: "Mr Cross", location: "Leeds", rating: 5, text: "Absolutely fantastic service from start to finish. The company that was matched to us handled our full kitchen and bathroom renovation seamlessly. Couldn't recommend enough!" },
  { name: "Mrs Rod", location: "Batley", rating: 5, text: "We were dreading managing multiple trades for our extension. One company did it all — plumbing, electrics, plastering, the lot. Stress-free experience." },
  { name: "Mr Patel", location: "Huddersfield", rating: 5, text: "The vetting process gave us real confidence. The team arrived on time, kept the site clean, and delivered exactly what was promised. Outstanding." },
  { name: "Mrs Johnson", location: "Dewsbury", rating: 4, text: "Great experience overall. Our loft conversion was completed on budget and ahead of schedule. The project manager kept us informed throughout." },
  { name: "Mr Davies", location: "Bristol", rating: 5, text: "From the initial quote to the final walkthrough, everything was professional. Our new flooring and interior renovation look incredible." },
  { name: "Mrs O'Brien", location: "Liverpool", rating: 5, text: "I was nervous about getting solar panels fitted, but the matched company explained everything clearly and the installation was flawless." },
  { name: "Mr Thompson", location: "Edinburgh", rating: 5, text: "Brilliant service. They handled our landscaping and driveway project with real care. The garden has been completely transformed." },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, si) => (
        <Star
          key={si}
          className={`h-4 w-4 ${si < rating ? "fill-oak-500 text-oak-500" : "text-warm-200"}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [featured, ...rest] = reviews;
  const supporting = rest.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-warm-100 border-y border-warm-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-oak-600 mb-3">Real homeowners</p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            What customers say about our vetted companies
          </h2>
        </div>

        {/* Featured pull-quote */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 mb-6">
          <div className="lg:col-span-7 relative rounded-3xl bg-card border border-warm-200 shadow-soft p-8 sm:p-10 overflow-hidden">
            <Quote
              aria-hidden
              className="absolute -top-4 -right-4 w-40 h-40 text-oak-500/10 rotate-180 pointer-events-none"
              strokeWidth={1}
            />
            <div className="relative">
              <StarRow rating={featured.rating} />
              <p className="font-display text-2xl sm:text-3xl font-semibold text-foreground leading-snug tracking-tight mt-5 mb-7">
                "{featured.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-oak flex items-center justify-center text-warm-50 font-display font-bold text-base">
                  {featured.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{featured.name}</p>
                  <p className="text-muted-foreground text-xs">{featured.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl overflow-hidden shadow-soft border border-warm-200">
            <img
              src={reviewsHeroImg}
              alt="Happy customer with contractor after renovation"
              loading="lazy"
              width={800}
              height={512}
              className="w-full h-full object-cover min-h-[260px]"
            />
          </div>
        </div>

        {/* Supporting reviews */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {supporting.map((r, i) => (
            <div key={i} className="rounded-2xl border border-warm-200 bg-card p-6 shadow-soft hover:shadow-lifted transition-shadow">
              <StarRow rating={r.rating} />
              <p className="text-foreground/80 text-sm leading-relaxed mt-4 mb-5">
                "{r.text}"
              </p>
              <div className="pt-4 border-t border-warm-200">
                <p className="font-semibold text-foreground text-sm">{r.name}</p>
                <p className="text-muted-foreground text-xs">{r.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
