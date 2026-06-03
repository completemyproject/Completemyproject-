import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SERVICES, filterServices } from "@/data/services";

type ServicesProps = {
  searchQuery?: string;
};

export default function Services({ searchQuery = "" }: ServicesProps) {
  const filtered = filterServices(SERVICES, searchQuery, "All");
  const isFiltered = searchQuery.trim().length > 0;

  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-warm-50 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-oak-600 mb-3">Categories</p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              {isFiltered ? "Search results" : "Browse our most popular categories"}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              {isFiltered
                ? filtered.length > 0
                  ? `Showing ${filtered.length} service${filtered.length === 1 ? "" : "s"}${searchQuery.trim() ? ` for “${searchQuery.trim()}”` : ""}.`
                  : "No services match your search. Try another keyword."
                : "From kitchens to rooftops — find the right expert for your project."}
            </p>
          </div>
          <Link
            to="/services"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-oak-600 transition-colors"
          >
            View all services <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-warm-200 bg-card/60 px-6 py-14 text-center">
            <p className="text-muted-foreground text-sm sm:text-base">
              No matching services. Clear your search or try a different keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-12 auto-rows-[180px] sm:auto-rows-[200px] gap-3 sm:gap-4">
            {filtered.map((s) => (
              <Link
                key={s.title}
                to={`/get-quotes?projects=${encodeURIComponent(s.title)}`}
                className={`group relative rounded-2xl overflow-hidden border border-warm-200 bg-card hover:shadow-lifted hover:-translate-y-0.5 transition-all duration-300 ${s.bentoSpan ?? "lg:col-span-3"}`}
              >
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-warm-50">
                  <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-warm-50/70 mb-1">
                        {s.category}
                      </span>
                      <h3 className="font-display font-bold text-sm sm:text-base leading-tight tracking-tight">
                        {s.title}
                      </h3>
                      <p className="text-warm-50/80 text-xs leading-snug mt-1 hidden sm:block line-clamp-2">
                        {s.desc}
                      </p>
                    </div>
                    <span className="shrink-0 w-8 h-8 rounded-full bg-warm-50/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-accent transition-colors">
                      <ArrowUpRight className="w-4 h-4 text-warm-50" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
