import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Briefcase, Clock, Heart, TrendingUp, Users, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const VALUES = [
  { Icon: Heart, title: "Customer obsession", desc: "We exist to make renovations less stressful. Every decision starts there." },
  { Icon: Sparkles, title: "Raise the standard", desc: "We believe the trades industry deserves better — and we're here to lead it." },
  { Icon: Users, title: "Built on trust", desc: "Honesty with our customers, our contractors, and each other. Always." },
  { Icon: TrendingUp, title: "Grow together", desc: "We invest in our people because the best teams build the best companies." },
];

const ROLES = [
  { title: "Business Development", department: "Sales", location: "Leeds", type: "Part-time or Full-time" },
  { title: "Business Development", department: "Sales", location: "Huddersfield", type: "Part-time or Full-time" },
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-warm-50 overflow-hidden">
        <div aria-hidden className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div aria-hidden className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-oak/10 blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-4">Careers at CMP</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-ink-900 mb-6 leading-[1.05]">
            Help us fix one of the<br />
            <span className="text-oak-600">UK's most broken industries.</span>
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed mb-8">
            We're a small, ambitious team on a mission to make home renovations stress-free for every UK homeowner. Want in?
          </p>
          <a
            href="#open-roles"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm px-6 py-3 rounded-full transition-colors"
          >
            See open roles <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-ink-900 text-warm-50 py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            {[
              { num: "100%", label: "Hybrid friendly" },
              { num: "2+", label: "Open roles" },
              { num: "1", label: "Mission" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-warm-50">{s.num}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-warm-50/60 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-3">How we work</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-foreground mb-4">
              Our values, in plain English.
            </h2>
            <p className="text-foreground/70 text-base sm:text-lg">No vague slogans — these are the principles we actually hire and fire on.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {VALUES.map(({ Icon, title, desc }) => (
              <div key={title} className="flex gap-5 p-7 bg-warm-50 border border-warm-200 rounded-2xl hover:shadow-soft transition-shadow">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-1.5 tracking-tight">{title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      {/* Open roles */}
      <section id="open-roles" className="py-20 sm:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-3">Open roles</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-foreground mb-4">
              Find your fit.
            </h2>
            <p className="text-foreground/70 text-base sm:text-lg">
              {ROLES.length} positions open right now. Don't see yours? <Link to="/contact" className="text-oak-600 font-semibold hover:underline">Tell us anyway</Link>.
            </p>
          </div>

          <ul className="divide-y divide-warm-200 border border-warm-200 rounded-2xl overflow-hidden bg-warm-50">
            {ROLES.map((role) => (
              <li key={role.title}>
                <Link
                  to="/contact"
                  className="group grid sm:grid-cols-12 items-center gap-4 p-5 sm:p-6 hover:bg-card transition-colors"
                >
                  <div className="sm:col-span-5">
                    <h3 className="font-display text-lg font-bold text-foreground tracking-tight group-hover:text-oak-600 transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3" /> {role.department}
                    </p>
                  </div>
                  <div className="sm:col-span-3 text-sm text-foreground/70 inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-oak-600" /> {role.location}
                  </div>
                  <div className="sm:col-span-2 text-sm text-foreground/70 inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-oak-600" /> {role.type}
                  </div>
                  <div className="sm:col-span-2 sm:text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-oak-600 bg-card border border-warm-200 px-4 py-2 rounded-full group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-all">
                      Apply <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-warm-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-foreground mb-5 leading-[1.05]">
            Don't see the perfect role?
          </h2>
          <p className="text-foreground/70 text-base sm:text-lg mb-8 leading-relaxed">
            We're always keen to hear from talented people who care about what we're building. Drop us a line.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm px-6 py-3 rounded-full transition-colors"
          >
            Get in touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
