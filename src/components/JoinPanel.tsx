import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import teamImg from "@/assets/team-workers.jpg";

export default function JoinPanel() {
  return (
    <section className="relative bg-ink-900 text-warm-50 py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div aria-hidden className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/15 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-oak/15 blur-3xl" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-4">For tradespeople</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] mb-5">
              Multi-trade company,<br />
              <span className="text-accent">join our panel</span>
            </h2>
            <p className="text-warm-50/70 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
              It's free to join, simply tick the box and complete the form. A member
              of staff will reach out to you within 72 hours of completing the form.
            </p>

            <Link
              to="/trades-login"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 py-3.5 rounded-full text-sm sm:text-base transition-colors shadow-lifted"
            >
              Apply to join the panel
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-xs text-warm-50/60">
              <div><span className="block font-display text-2xl font-extrabold text-warm-50">72h</span>response time</div>
              <div><span className="block font-display text-2xl font-extrabold text-warm-50">£0</span>to join</div>
              <div><span className="block font-display text-2xl font-extrabold text-warm-50">UK</span>nationwide demand</div>
            </div>
          </div>

          {/* Right: image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-lifted ring-1 ring-warm-50/10">
              <img
                src={teamImg}
                alt="Team of workers"
                loading="lazy"
                width={1024}
                height={576}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
