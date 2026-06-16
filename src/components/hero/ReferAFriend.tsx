import { Gift, ArrowRight } from "lucide-react";
import ReferAFriendDialog from "./ReferAFriendDialog";

const REFERRAL_STEPS = [
  "Share your unique referral link with a friend",
  "They submit a project and get matched",
  "You receive £250 once the project is confirmed",
];

export default function ReferAFriend() {
  return (
    <section aria-labelledby="refer-heading" className="py-16 sm:py-20 lg:py-24 bg-warm-100/50 border-y border-warm-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-oak-600 mb-3">Rewards programme</p>
          <h2 id="refer-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Refer a friend & earn £250
          </h2>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="grid md:grid-cols-[1fr,auto,12rem] rounded-3xl bg-card border border-warm-200 shadow-lifted overflow-hidden">
            <div className="p-7 sm:p-9">
              <div className="inline-flex items-center gap-2 bg-warm-100 text-oak-600 rounded-full px-3 py-1 text-xs font-bold mb-4">
                <Gift className="w-3.5 h-3.5" />
                Limited time offer
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground mb-3 leading-tight tracking-tight">
                Refer a Friend &<br />
                <span className="text-oak-600">Receive £250</span>
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                Know someone planning a renovation? Refer them to completemyproject. When their project is confirmed and the customer pays, you'll receive <strong className="text-foreground">£250 cash back</strong> as a thank you.
              </p>
              <ol className="space-y-2.5 mb-6">
                {REFERRAL_STEPS.map((step, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-ink-900 flex items-center justify-center shrink-0">
                      <span className="text-warm-50 text-[11px] font-bold">{i + 1}</span>
                    </span>
                    <span className="text-foreground text-sm">{step}</span>
                  </li>
                ))}
              </ol>
              <ReferAFriendDialog>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-5 py-3 rounded-full text-sm transition-colors"
                >
                  Refer a friend <ArrowRight className="w-4 h-4" />
                </button>
              </ReferAFriendDialog>
            </div>

            <div aria-hidden className="hidden md:flex flex-col items-center justify-between py-4 relative">
              <div className="w-3 h-3 rounded-full bg-warm-100/50 border border-warm-200 -ml-1.5 -mt-1.5 absolute top-0" />
              <div className="w-3 h-3 rounded-full bg-warm-100/50 border border-warm-200 -ml-1.5 -mb-1.5 absolute bottom-0" />
              <div className="h-full w-px border-l-2 border-dashed border-warm-200" />
            </div>

            <div className="bg-gradient-to-br from-warm-100 to-warm-200 flex items-center justify-center p-6">
              <div className="w-32 h-32 rounded-full bg-gradient-oak shadow-lifted flex flex-col items-center justify-center text-center text-warm-50 ring-4 ring-warm-50/40">
                <span className="font-display text-4xl font-extrabold leading-none">£250</span>
                <p className="text-[10px] font-semibold uppercase tracking-wider mt-1 opacity-90">per referral</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
