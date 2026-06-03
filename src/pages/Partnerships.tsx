import { useState } from "react";
import { z } from "zod";
import { Link } from "react-router-dom";
import { ArrowRight, Handshake, ShieldCheck, Building2, Home, Briefcase, Calculator, PencilRuler, Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notifyPartnershipSubmitted } from "@/lib/emailService";
import partnershipImage from "@/assets/partnership-handshake.jpg";

const PARTNER_TYPES = [
  { Icon: Home, label: "Letting agent" },
  { Icon: Building2, label: "Estate agent" },
  { Icon: Briefcase, label: "Commercial agent" },
  { Icon: Calculator, label: "Valuer" },
  { Icon: PencilRuler, label: "Architect" },
  { Icon: Package, label: "Material supplier" },
];

const PARTNER_OPTIONS = ["Letting agent", "Estate agent", "Commercial agent", "Valuer", "Architect", "Material supplier", "Other"];

const partnerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(7, "Please enter a valid phone").max(30),
  company: z.string().trim().min(2, "Please enter your company").max(150),
  partnerType: z.string().min(1).max(100),
  message: z.string().trim().min(10, "Please add a few more details (min 10 chars)").max(2000),
});

export default function Partnerships() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    partnerType: "Letting agent",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = partnerSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      topic: `Partnership — ${parsed.data.partnerType}`,
      message: `Company: ${parsed.data.company}\n\n${parsed.data.message}`,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: "Couldn't send", description: "Please try again or email us directly.", variant: "destructive" });
      return;
    }

    notifyPartnershipSubmitted({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      partnerType: parsed.data.partnerType,
      message: parsed.data.message,
    });

    toast({ title: "Application received", description: "Our partnerships team will be in touch within one working day." });
    setForm({ name: "", email: "", phone: "", company: "", partnerType: "Letting agent", message: "" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-warm-50 overflow-hidden">
        <div aria-hidden className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        <div aria-hidden className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-oak/10 blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-card border border-warm-200 rounded-full px-3 py-1.5 mb-6 shadow-soft">
            <Handshake className="w-3.5 h-3.5 text-oak-600" />
            <span className="text-xs font-semibold text-foreground tracking-tight">Partner with us</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-ink-900 mb-5 leading-[1.05]">
            Partnerships
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            We're growing our UK partner network. Refer your clients to vetted, reliable companies — and earn for every introduction.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 sm:mb-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-4">Why partner with CMP</p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-ink-900 mb-5 leading-[1.1]">
                Best-in-class service for your clients.
              </h2>
              <p className="text-base sm:text-lg text-foreground/75 leading-relaxed mb-5">
                Confidently introduce your clients to vetted, reliable companies — so they never come back saying they were let down or overcharged.
              </p>
              <p className="text-base sm:text-lg text-foreground/75 leading-relaxed mb-6">
                If you'd like to become an official partner, it's simple: complete the form below and a member of our team will be in touch.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-5 border-t border-warm-200">
                <div>
                  <div className="font-display text-2xl font-extrabold text-ink-900 leading-none">100%</div>
                  <div className="text-xs text-foreground/60 mt-1">Vetted firms</div>
                </div>
                <div className="h-8 w-px bg-warm-200" />
                <div>
                  <div className="font-display text-2xl font-extrabold text-ink-900 leading-none">24h</div>
                  <div className="text-xs text-foreground/60 mt-1">Response time</div>
                </div>
                <div className="h-8 w-px bg-warm-200" />
                <div>
                  <div className="font-display text-2xl font-extrabold text-ink-900 leading-none">UK-wide</div>
                  <div className="text-xs text-foreground/60 mt-1">Coverage</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div aria-hidden className="absolute -inset-4 bg-oak/10 rounded-[2rem] blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-warm-200 shadow-soft aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
                <img
                  src={partnershipImage}
                  alt="Letting agent partnering with Complete My Project to refer trusted vetted contractors"
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="w-full h-full object-cover"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-900/30 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-5 -left-2 sm:bottom-6 sm:left-6 bg-card border border-warm-200 rounded-2xl px-4 py-3 shadow-soft max-w-[230px]">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-oak-600" />
                  <span className="text-xs font-semibold text-foreground">Trusted referrals</span>
                </div>
                <p className="text-[11px] text-foreground/60 leading-snug">Every introduction backed by our 6-point vetting check.</p>
              </div>
            </div>
          </div>

          {/* Who we partner with — full width below */}
          <div className="bg-warm-50 border border-warm-200 rounded-3xl p-7 sm:p-10 shadow-soft">
            <div className="max-w-2xl mb-7">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-oak-600" />
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600">Who we partner with</p>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-ink-900 mb-3 leading-[1.15]">
                Built for property professionals.
              </h3>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                If you work with clients who have property or construction projects, you can refer them to trusted vetted companies through us.
              </p>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {PARTNER_TYPES.map(({ Icon, label }) => (
                <li
                  key={label}
                  className="flex flex-col items-center text-center gap-2.5 bg-card border border-warm-200 rounded-2xl px-3 py-5 hover:border-oak-300 transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-oak/10">
                    <Icon className="w-5 h-5 text-oak-600" />
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-foreground leading-tight">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 sm:py-20 bg-warm-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-ink-900 mb-3 leading-[1.1]">
              Become a partner
            </h2>
            <p className="text-base text-foreground/70 max-w-xl mx-auto leading-relaxed">
              Tell us about your business — we'll be in touch within one working day.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card border border-warm-200 rounded-3xl p-7 sm:p-10 shadow-soft"
            noValidate
          >
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Field label="Full name" required error={errors.name}>
                <input
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-warm-50 border border-warm-200 rounded-xl outline-none focus:border-oak-500 transition-colors"
                />
              </Field>
              <Field label="Company" required error={errors.company}>
                <input
                  maxLength={150}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-warm-50 border border-warm-200 rounded-xl outline-none focus:border-oak-500 transition-colors"
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Field label="Email" required error={errors.email}>
                <input
                  type="email"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-warm-50 border border-warm-200 rounded-xl outline-none focus:border-oak-500 transition-colors"
                />
              </Field>
              <Field label="Phone" required error={errors.phone}>
                <input
                  type="tel"
                  maxLength={30}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-warm-50 border border-warm-200 rounded-xl outline-none focus:border-oak-500 transition-colors"
                />
              </Field>
            </div>

            <div className="mb-4">
              <Field label="I am a" required>
                <select
                  value={form.partnerType}
                  onChange={(e) => setForm({ ...form, partnerType: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-warm-50 border border-warm-200 rounded-xl outline-none focus:border-oak-500 transition-colors"
                >
                  {PARTNER_OPTIONS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Tell us about your business" required error={errors.message}>
              <textarea
                rows={5}
                maxLength={2000}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-warm-50 border border-warm-200 rounded-xl outline-none focus:border-oak-500 transition-colors resize-none"
                placeholder="How many clients do you typically refer? What kinds of projects?"
              />
            </Field>

            <p className="text-xs text-muted-foreground mt-4 mb-6 leading-relaxed">
              By submitting, you agree to our <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>. We'll only use your details to discuss the partnership.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-60 text-accent-foreground font-semibold text-sm px-7 py-3.5 rounded-full transition-colors"
            >
              {submitting ? "Sending…" : "Submit application"}
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      {children}
      {error && <span className="block mt-1.5 text-xs text-destructive">{error}</span>}
    </label>
  );
}
