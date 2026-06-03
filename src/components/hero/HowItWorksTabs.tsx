import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const STEPS = [
  { number: "01", title: "Fill in a quick form", desc: "Provide your contact details and outline your project." },
  { number: "02", title: "Get matched", desc: "A multi-trade company (no more than three options), which has been fully vetted, will contact you and provide a quote." },
  { number: "03", title: "Get one fixed quote", desc: "They provide a single price for the entire job. One point of contact. Zero coordination stress." },
];

export default function HowItWorksTabs() {
  const navigate = useNavigate();

  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="py-16 sm:py-20 lg:py-24 bg-warm-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-oak-600 mb-3">A simple journey</p>
          <h2 id="how-it-works-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            How it works
          </h2>
          <p className="mt-4 text-foreground/70 text-base sm:text-lg">Three simple steps from idea to finished project.</p>
        </div>

        <div className="relative">
          <div aria-hidden className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-warm-200 to-transparent" />

          <ol className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
            {STEPS.map((step, i) => (
              <li key={step.number} className="relative">
                {i < STEPS.length - 1 && (
                  <div aria-hidden className="md:hidden absolute left-6 top-12 bottom-[-2rem] w-px bg-warm-200" />
                )}
                <div className="flex md:flex-col items-start md:items-center gap-5 md:gap-4 md:text-center">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-card border border-warm-200 shadow-soft flex items-center justify-center relative z-10">
                    <span className="font-display text-sm font-extrabold text-oak-600 tracking-tight">{step.number}</span>
                  </div>
                  <div className="flex-1 md:max-w-xs">
                    <h3 className="font-display text-lg font-bold text-foreground mb-2 tracking-tight">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                    {i === 1 && (
                      <div className="flex justify-center mt-4">
                        <button
                          type="button"
                          onClick={() => navigate("/get-quotes")}
                          className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground rounded-full px-4 py-2 text-xs font-semibold hover:bg-accent/90 transition-colors"
                        >
                          Get a free quote <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
