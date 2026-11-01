import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const STEPS = [
  {
    title: "We Find the Customer",
    body: [
      "CompleteMyProject.co.uk does the work to identify and generate new project opportunities through our marketing, social media, tenders and other lead-generation activities.",
    ],
  },
  {
    title: "We Introduce You to the Customer",
    body: [
      "When we identify a suitable project, we introduce the customer to one of our CMP multi-trade companies.",
      "Each customer will have a maximum of three CMP companies quoting for the same job.",
      "This means you are never competing against a large number of contractors. At most, three CMP companies will be given the opportunity to quote.",
    ],
  },
  {
    title: "You Contact the Customer",
    body: [
      "Once we introduce you, you deal directly with the customer.",
      "You arrange the site visit, discuss the requirements, prepare your quotation and agree the work directly with the customer.",
    ],
  },
  {
    title: "You Win the Job",
    body: ["If the customer chooses your company, you carry out the work as agreed."],
  },
  {
    title: "We Only Get Paid When You Get Paid",
    body: [
      "There is no upfront payment for the introduction.",
      "Once you start the project and receive payment from the customer, CMP charges an agreed percentage of the value of the job.",
      "You only pay CMP when you get paid.",
    ],
  },
];

const SUMMARY = [
  "We find the opportunities.",
  "We introduce the customer.",
  "You quote directly.",
  "You win and complete the work.",
  "You get paid.",
  "We get paid.",
];

export default function TradeInformation() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-warm-50 overflow-hidden">
        <div aria-hidden className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div aria-hidden className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-oak/10 blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-4">For trades</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-ink-900 mb-6 leading-[1.05]">
            Trade Information
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed mb-8">
            Everything multi-trade companies need to know about working with Complete My Project.
          </p>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm px-6 py-3 rounded-full transition-colors"
          >
            How it works <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-card scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-3">The process</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-foreground">
              How It Works
            </h2>
          </div>

          <ol className="space-y-5">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-5 sm:gap-6 p-6 sm:p-7 bg-warm-50 border border-warm-200 rounded-2xl"
              >
                <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center font-display text-lg font-extrabold text-accent">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2 tracking-tight">{step.title}</h3>
                  <div className="space-y-2">
                    {step.body.map((p) => (
                      <p key={p} className="text-sm sm:text-base text-foreground/70 leading-relaxed">{p}</p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Summary */}
      <section className="py-20 sm:py-24 bg-ink-900 text-warm-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] mb-10 leading-[1.05]">
            Simple. Fair. Performance-Based.
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto text-left">
            {SUMMARY.map((line) => (
              <li key={line} className="flex items-center gap-3 rounded-xl bg-warm-50/5 border border-warm-50/10 px-5 py-4">
                <Check className="w-4 h-4 shrink-0 text-accent" />
                <span className="text-sm sm:text-base text-warm-50/90">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-warm-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-foreground mb-8 leading-[1.05]">
            It's That Simple.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/trades-login"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm px-6 py-3 rounded-full transition-colors"
            >
              Trade Login / Sign Up <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border-[1.5px] border-oak-600 text-oak-600 hover:bg-oak-600 hover:text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
