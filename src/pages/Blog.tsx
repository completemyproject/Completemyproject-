import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, Search } from "lucide-react";
import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { POSTS, CATEGORIES } from "@/data/blogPosts";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export default function Blog() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");

  const featured = POSTS[0];
  const rest = useMemo(
    () =>
      POSTS.slice(1).filter((p) => {
        const matchCat = active === "All" || p.category === active;
        const q = query.trim().toLowerCase();
        const matchQ = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
        return matchCat && matchQ;
      }),
    [active, query]
  );

  const showFeatured = (active === "All" || active === featured.category) && !query.trim();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-warm-50 overflow-hidden">
        <div aria-hidden className="absolute -top-20 right-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-4">Insights & guides</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-ink-900 mb-5 leading-[1.05]">
            The Renovation Journal
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Honest advice, expert tips, and real cost breakdowns to help you plan your next project with confidence.
          </p>

          <div className="mt-8 max-w-md mx-auto">
            <label className="flex items-center bg-card rounded-full shadow-soft border border-warm-200 overflow-hidden">
              <Search className="w-4 h-4 text-muted-foreground ml-5 shrink-0" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                aria-label="Search articles"
                className="flex-1 px-3 py-3.5 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground/60"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-card border-y border-warm-200 sticky top-16 z-30 backdrop-blur-md bg-card/90">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
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

      {/* Featured */}
      {showFeatured && (
        <section className="py-12 sm:py-16 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <Link to={`/blog/${featured.slug}`} className="group block">
              <article className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-warm-50 border border-warm-200 rounded-3xl overflow-hidden shadow-soft hover:shadow-lifted transition-shadow">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.imageAlt}
                    width={1280}
                    height={800}
                    loading="eager"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {featured.tag && (
                    <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-card text-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-soft">
                      {featured.tag}
                    </span>
                  )}
                </div>
                <div className="p-8 sm:p-10">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span className="font-semibold text-oak-600">{featured.category}</span>
                    <span aria-hidden>·</span>
                    <time dateTime={featured.date} className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formatDate(featured.date)}
                    </time>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readMins} min</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[-0.02em] text-foreground mb-4 group-hover:text-oak-600 transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-foreground/70 text-base leading-relaxed mb-6">{featured.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-oak-600 group-hover:gap-2.5 transition-all">
                    Read article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            </Link>
          </div>
        </section>
      )}

      {/* Posts grid */}
      <section className="py-12 sm:py-16 bg-warm-50 flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {rest.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No articles match your search.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="group block">
                  <article className="h-full bg-card border border-warm-200 rounded-2xl overflow-hidden shadow-soft hover:shadow-lifted hover:-translate-y-1 transition-all">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.imageAlt}
                        width={1280}
                        height={800}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
                        <span className="font-semibold text-oak-600 uppercase tracking-wider">{post.category}</span>
                        <span aria-hidden>·</span>
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readMins} min</span>
                      </div>
                      <h3 className="font-display text-lg font-bold tracking-tight text-foreground mb-2 leading-snug group-hover:text-oak-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <div className="mt-4 pt-4 border-t border-warm-200 flex items-center justify-between text-xs">
                        <time dateTime={post.date} className="text-muted-foreground inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(post.date)}
                        </time>
                        <span className="font-semibold text-oak-600 group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                          Read <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
