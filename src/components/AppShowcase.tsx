import { Smartphone } from "lucide-react";
import phoneImg from "@/assets/app-mockup-pro.png";

export default function AppShowcase() {
  return (
    <section className="relative py-14 sm:py-24 lg:py-32 bg-warm-50 overflow-hidden">
      {/* decorative background */}
      <div aria-hidden className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-oak/10 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-20 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-card border border-warm-200 rounded-full px-3 py-1.5 mb-6 shadow-soft">
              <Smartphone className="w-3.5 h-3.5 text-oak-600" />
              <span className="text-xs font-semibold text-foreground tracking-tight">
                Available on iOS &amp; Android
              </span>
            </div>

            <h2 className="font-display text-[2rem] sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-ink-900 mb-5 sm:mb-6 leading-[0.98]">
              Your renovation,<br />
              <span className="text-oak-600">in your pocket.</span>
            </h2>

            <p className="text-base sm:text-xl text-foreground/75 leading-relaxed mb-8 sm:mb-10 max-w-xl">
              Manage quotes, milestones, messages and payments from one simple app —
              built to take the stress out of home improvement.
            </p>

            <div className="flex flex-row flex-nowrap gap-2 sm:gap-3">
              <a
                href="#"
                aria-label="Download on the App Store"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 sm:gap-3 bg-ink-900 text-warm-50 rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2.5 sm:py-3.5 hover:-translate-y-0.5 hover:shadow-lifted transition-all shadow-soft"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 fill-current" aria-hidden>
                  <path d="M16.365 1.43c0 1.14-.42 2.22-1.12 3.02-.74.86-1.95 1.52-3.04 1.45-.13-1.11.42-2.27 1.1-3.02.78-.85 2.07-1.5 3.06-1.45zM20.5 17.32c-.55 1.27-.82 1.84-1.53 2.96-1 1.57-2.4 3.53-4.13 3.55-1.54.02-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.99-1.74-.02-3.07-1.79-4.07-3.36C-.27 16.4-.6 11.32 1.6 8.6c1.55-1.94 4-3.07 6.3-3.07 2.34 0 3.81 1.28 5.74 1.28 1.88 0 3.02-1.28 5.72-1.28 2.04 0 4.21 1.11 5.76 3.03-5.06 2.77-4.24 10.01-4.62 8.76z"/>
                </svg>
                <span className="flex flex-col leading-tight text-left">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider opacity-75">Download on the</span>
                  <span className="text-sm sm:text-base font-display font-bold">App Store</span>
                </span>
              </a>
              <a
                href="#"
                aria-label="Get it on Google Play"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 sm:gap-3 bg-ink-900 text-warm-50 rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2.5 sm:py-3.5 hover:-translate-y-0.5 hover:shadow-lifted transition-all shadow-soft"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" aria-hidden>
                  <path fill="#34A853" d="M3.6 2.3 16.8 15.5l3.5-3.5L4.5 1.9c-.3-.1-.6-.1-.9.4z"/>
                  <path fill="#FBBC04" d="m20.3 12-3.5-3.5-3.6 3.5 3.6 3.5L20.3 12z"/>
                  <path fill="#EA4335" d="M3.6 21.7c.3.5.6.5.9.4l15.8-10.1-3.5-3.5L3.6 21.7z"/>
                  <path fill="#4285F4" d="M3.6 2.3C3.2 2.7 3 3.3 3 4.1v15.8c0 .8.2 1.4.6 1.8L16.8 12 3.6 2.3z"/>
                </svg>
                <span className="flex flex-col leading-tight text-left">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider opacity-75">Get it on</span>
                  <span className="text-sm sm:text-base font-display font-bold">Google Play</span>
                </span>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <div>
                <p className="font-display text-2xl font-extrabold text-ink-900 leading-none">4.9★</p>
                <p className="text-xs text-muted-foreground mt-1">App Store rating</p>
              </div>
              <div className="h-10 w-px bg-warm-200" />
              <div>
                <p className="font-display text-2xl font-extrabold text-ink-900 leading-none">10k+</p>
                <p className="text-xs text-muted-foreground mt-1">Active homeowners</p>
              </div>
              <div className="h-10 w-px bg-warm-200" />
              <div>
                <p className="font-display text-2xl font-extrabold text-ink-900 leading-none">Free</p>
                <p className="text-xs text-muted-foreground mt-1">To download</p>
              </div>
            </div>
          </div>

          {/* Right: phone image */}
          <div className="lg:col-span-5 order-1 lg:order-2 relative">
            <div className="relative mx-auto max-w-[16rem] sm:max-w-[19rem]">
              {/* glow */}
              <div aria-hidden className="absolute inset-0 -z-10 flex items-center justify-center">
                <div className="w-[120%] h-[120%] rounded-full bg-gradient-to-br from-oak/25 via-accent/10 to-transparent blur-3xl" />
              </div>
              <img
                src={phoneImg}
                alt="CompleteMyProject mobile app showing project tracking and milestone progress"
                width={848}
                height={1264}
                loading="lazy"
                className="relative w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}