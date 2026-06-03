import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FAQS } from "@/data/faqs";

export default function Faq() {
  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 bg-warm-50 overflow-hidden">
        <div aria-hidden className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        <div aria-hidden className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-oak/10 blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-4">Help centre</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-ink-900 mb-5 leading-[1.05]">
            Frequently asked questions
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Clear answers about how we vet companies, who you pay, and what to expect.
          </p>
        </div>
      </section>

      <main>
        <FaqSection showAll showCta={false} hideHeader />

        {/* Bottom CTA */}
        <section className="py-16 sm:py-20 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-ink-900 mb-4">
              Still have a question?
            </h2>
            <p className="text-base text-foreground/70 mb-7 max-w-xl mx-auto leading-relaxed">
              Our team responds to every enquiry within one working day.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm px-6 py-3 rounded-full transition-colors"
              >
                Contact us <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/get-quotes"
                className="inline-flex items-center gap-2 bg-card border border-warm-200 hover:border-oak-500 text-foreground font-semibold text-sm px-6 py-3 rounded-full transition-colors shadow-soft"
              >
                Get a free quote
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
