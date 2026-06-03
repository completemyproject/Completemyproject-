import { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPostBySlug, getRelatedPosts, type BlogSection } from "@/data/blogPosts";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

const SITE_URL = "https://completemyproject.co.uk";

function renderSection(section: BlogSection, idx: number) {
  switch (section.type) {
    case "h2":
      return (
        <h2 key={idx} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-12 mb-4 leading-tight">
          {section.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={idx} className="font-display text-xl font-bold tracking-tight text-foreground mt-8 mb-3 leading-snug">
          {section.text}
        </h3>
      );
    case "p":
      return (
        <p key={idx} className="text-foreground/80 text-base sm:text-lg leading-relaxed mb-5">
          {section.text}
        </p>
      );
    case "ul":
      return (
        <ul key={idx} className="space-y-2.5 mb-6 pl-1">
          {section.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-foreground/80 text-base leading-relaxed">
              <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-oak-500" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote key={idx} className="my-8 border-l-4 border-oak-500 bg-warm-50 px-6 py-5 rounded-r-xl">
          <p className="font-display text-lg sm:text-xl text-ink-900 italic leading-relaxed">"{section.text}"</p>
        </blockquote>
      );
    default:
      return null;
  }
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    if (!post) return;
    const url = `${SITE_URL}/blog/${post.slug}`;
    document.title = `${post.title} | Complete My Project`;

    const setMeta = (selector: string, attr: string, value: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
      if (!el) {
        el = (selector.startsWith("link") ? document.createElement("link") : document.createElement("meta")) as any;
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      if (el.tagName === "META") (el as HTMLMetaElement).content = content;
      else (el as HTMLLinkElement).href = content;
    };

    setMeta('meta[name="description"]', "name", "description", post.metaDescription);
    setMeta('meta[name="keywords"]', "name", "keywords", post.keywords.join(", "));
    setMeta('link[rel="canonical"]', "rel", "canonical", url);
    setMeta('meta[property="og:title"]', "property", "og:title", post.title);
    setMeta('meta[property="og:description"]', "property", "og:description", post.metaDescription);
    setMeta('meta[property="og:type"]', "property", "og:type", "article");
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:image"]', "property", "og:image", `${SITE_URL}${post.image}`);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", post.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", post.metaDescription);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", `${SITE_URL}${post.image}`);

    // JSON-LD Article schema
    const ldId = "blog-post-jsonld";
    document.getElementById(ldId)?.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = ldId;
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.metaDescription,
      image: `${SITE_URL}${post.image}`,
      datePublished: post.date,
      author: { "@type": "Organization", name: post.author },
      publisher: {
        "@type": "Organization",
        name: "Complete My Project",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.svg` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
    });
    document.head.appendChild(script);

    return () => {
      document.getElementById(ldId)?.remove();
    };
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  const related = getRelatedPosts(post.slug, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <article className="flex-1">
        {/* Hero */}
        <header className="relative pt-32 pb-10 sm:pt-40 sm:pb-14 bg-warm-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-oak-600 hover:text-oak-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All articles
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-3">{post.category}</p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-ink-900 mb-5 leading-[1.1]">
              {post.title}
            </h1>
            <p className="text-base sm:text-lg text-foreground/70 leading-relaxed mb-6 max-w-3xl">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author}</span>
              <time dateTime={post.date} className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {formatDate(post.date)}
              </time>
              <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readMins} min read</span>
            </div>
          </div>
        </header>

        {/* Cover image */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl -mt-2 sm:-mt-4 mb-8 sm:mb-12">
          <img
            src={post.image}
            alt={post.imageAlt}
            width={1280}
            height={800}
            loading="eager"
            className="w-full aspect-[16/10] object-cover rounded-2xl shadow-lifted"
          />
        </div>

        {/* Body */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl pb-16">
          {post.sections.map(renderSection)}

          {/* CTA */}
          <div className="mt-14 bg-ink-900 text-warm-50 rounded-3xl p-8 sm:p-10 shadow-lifted">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 leading-tight">
              Ready to start your project?
            </h2>
            <p className="text-warm-50/70 leading-relaxed mb-6 max-w-lg">
              Get matched with two vetted multi-trade companies in under two minutes. One project, one price, zero stress.
            </p>
            <Link
              to="/get-quotes"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm px-6 py-3 rounded-full transition-colors"
            >
              Get a free quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="bg-warm-50 py-16 border-t border-warm-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-8">
                Keep reading
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <Link key={p.slug} to={`/blog/${p.slug}`} className="group block">
                    <article className="h-full bg-card border border-warm-200 rounded-2xl overflow-hidden shadow-soft hover:shadow-lifted hover:-translate-y-1 transition-all">
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={p.image}
                          alt={p.imageAlt}
                          width={1280}
                          height={800}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-oak-600 mb-2">{p.category}</p>
                        <h3 className="font-display text-base font-bold text-foreground leading-snug group-hover:text-oak-600 transition-colors line-clamp-2">
                          {p.title}
                        </h3>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <Footer />
    </div>
  );
}
