import { Link } from "react-router-dom";
import { ArrowRight, Quote, Hammer, Clock, PoundSterling, ShieldCheck, Sparkles, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import founderImage from "@/assets/founder-landlord.jpg";

const STRUGGLES = [
  { Icon: Clock, title: "Endless chasing", desc: "Calls, texts, no-shows — managing trades became a second job." },
  { Icon: PoundSterling, title: "Spiralling costs", desc: "Delays meant overlapping bills and budget blowouts." },
  { Icon: Hammer, title: "Coordination chaos", desc: "Plumber waiting on the electrician, who was waiting on the plasterer." },
];

const VALUES = [
  { Icon: ShieldCheck, title: "Trust above all", desc: "Every company on our panel passes our 6-Point Gold Standard vetting." },
  { Icon: Sparkles, title: "One point of contact", desc: "No more juggling. One company manages your project from start to finish." },
  { Icon: Heart, title: "Customer first", desc: "We obsess over your experience — because we've been in your shoes." },
];

export default function OurStory() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-warm-50 overflow-hidden">
        <div aria-hidden className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        <div aria-hidden className="absolute bottom-0 -right-24 w-96 h-96 rounded-full bg-oak/10 blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-4">Our Story</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-ink-900 mb-6 leading-[1.05]">
            Born from frustration.<br />
            <span className="text-oak-600">Built for homeowners.</span>
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            The story behind Complete My Project — and why we exist to take the stress out of renovations.
          </p>
        </div>
      </section>

      {/* The story */}
      <section className="py-20 sm:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text content */}
            <div className="relative bg-warm-50 border border-warm-200 rounded-3xl p-8 sm:p-10 shadow-soft order-2 lg:order-1">
              <Quote className="absolute -top-5 left-8 w-10 h-10 text-oak-500 bg-card p-2 rounded-full border border-warm-200" />

              <p className="font-display text-xl sm:text-2xl text-ink-900 leading-relaxed mb-6 tracking-tight">
                "As a landlord, I believed I had plenty of experience managing and coordinating tradespeople. However, that all changed when I started work on my own home."
              </p>

              <div className="space-y-4 text-foreground/80 leading-relaxed text-base">
                <p>
                  I quickly realised how difficult the process can be. I was constantly chasing tradespeople, making calls, and dealing with delays. Some arrived late, worked only a few hours, and then didn't return for days or even weeks. The project was delayed, costs increased, and the stress quickly built up.
                </p>
                <p>
                  Looking back, I would have much preferred working with one reliable company — a single point of contact who could manage and coordinate all the trades on my behalf. It would have saved time, money, and a great deal of frustration.
                </p>
                <p>
                  That experience inspired the idea behind <span className="font-semibold text-oak-600">Complete My Project</span> — a service built around vetted contractors who take the stress out of managing projects, allowing customers to focus on their daily lives without the worry and pressure that renovations often bring.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-warm-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-oak-500 to-oak-600 flex items-center justify-center text-warm-50 font-display font-extrabold text-lg shrink-0">
                  F
                </div>
                <div>
                  <p className="font-display font-bold text-foreground">Founder</p>
                  <p className="text-xs text-muted-foreground tracking-wide">Complete My Project</p>
                </div>
              </div>
            </div>

            {/* Founder image */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-oak-500/20 to-oak-600/10 rounded-3xl blur-2xl" />
                <img
                  src={founderImage}
                  alt="Founder - Property landlord and entrepreneur"
                  className="relative w-full h-auto rounded-2xl shadow-soft object-cover aspect-[4/5]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The struggles */}
      <section className="py-20 sm:py-24 bg-warm-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-3">The problem</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-foreground mb-4">
              Sound familiar?
            </h2>
            <p className="text-foreground/70 text-base sm:text-lg">
              These are the headaches we set out to eliminate — for good.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {STRUGGLES.map(({ Icon, title, desc }) => (
              <div key={title} className="bg-card border border-warm-200 rounded-2xl p-7 shadow-soft hover:shadow-lifted transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2 tracking-tight">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / values */}
      <section className="py-20 sm:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-3">Our mission</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-foreground mb-6 leading-[1.05]">
                A smooth, positive experience — every single time.
              </h2>
              <p className="text-foreground/70 text-base sm:text-lg leading-relaxed mb-8">
                Our goal is simple: to ensure every customer has a smooth, positive experience when using Complete My Project. We do that by handing the heavy lifting to vetted multi-trade companies who actually deliver.
              </p>
              <Link
                to="/get-quotes"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm px-6 py-3 rounded-full transition-colors"
              >
                Get a free quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {VALUES.map(({ Icon, title, desc }) => (
                <div key={title} className="flex gap-5 p-6 bg-warm-50 border border-warm-200 rounded-2xl">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-oak-500/10 border border-oak-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-oak-600" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-1 tracking-tight">{title}</h3>
                    <p className="text-sm text-foreground/70 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
