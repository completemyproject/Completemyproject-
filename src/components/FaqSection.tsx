import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQS } from "@/data/faqs";

interface FaqSectionProps {
  showAll?: boolean;
  showCta?: boolean;
  hideHeader?: boolean;
}

export default function FaqSection({ showAll = false, showCta = true, hideHeader = false }: FaqSectionProps) {
  const items = showAll ? FAQS : FAQS.slice(0, 6);

  return (
    <section className="py-20 sm:py-24 bg-warm-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {!hideHeader && (
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-4">FAQ</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-ink-900 mb-4 leading-[1.05]">
              Frequently asked questions
            </h2>
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about how Complete My Project works.
            </p>
          </div>
        )}

        <Accordion type="single" collapsible className="space-y-3">
          {items.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-card border border-warm-200 rounded-2xl px-5 sm:px-6 shadow-soft data-[state=open]:shadow-lifted transition-shadow"
            >
              <AccordionTrigger className="text-left font-display font-bold text-base sm:text-lg text-ink-900 hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-foreground/75 leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {showCta && !showAll && (
          <div className="mt-10 text-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 bg-card border border-warm-200 hover:border-oak-500 text-foreground font-semibold text-sm px-6 py-3 rounded-full transition-colors shadow-soft"
            >
              See all FAQs
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
