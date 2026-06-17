import { useState } from "react";
import { Mail, MapPin, MessageSquare, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notifyContactSubmitted } from "@/lib/emailService";

const CONTACTS = [
  { Icon: Mail, label: "Email", value: "info@completemyproject.co.uk", href: "mailto:info@completemyproject.co.uk" },
  { Icon: MapPin, label: "Office", value: "4 Railway Street, Huddersfield, HD1 1JP", href: null },
  { Icon: Clock, label: "Hours", value: "Mon–Fri · 9am – 6pm", href: null },
];

const TOPICS = ["General enquiry", "Quote support", "Become a contractor", "Press & media", "Complaint"];

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100, "Name too long"),
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email").max(255),
  phone: z.string().trim().max(30, "Phone too long").optional().or(z.literal("")),
  topic: z.string().min(1).max(100),
  message: z.string().trim().min(10, "Please add a few more details (min 10 chars)").max(2000, "Message too long"),
  agreeToPrivacy: z.literal(true, { errorMap: () => ({ message: "You must agree to the Privacy Policy to continue" }) }),
});

export default function Contact() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "General enquiry", message: "", agreeToPrivacy: false, marketingOptIn: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      await notifyContactSubmitted({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        topic: parsed.data.topic,
        message: parsed.data.message,
      });
    } catch {
      setSubmitting(false);
      toast({ title: "Failed to send", description: "We couldn't send your message. Please try again or email us directly.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      topic: parsed.data.topic,
      message: parsed.data.message,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: "Couldn't save your message", description: "Please try again or email us directly.", variant: "destructive" });
      return;
    }

    toast({ title: "Message sent", description: "We'll get back to you within one working day." });
    setForm({ name: "", email: "", phone: "", topic: "General enquiry", message: "", agreeToPrivacy: false, marketingOptIn: false });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-warm-50 overflow-hidden">
        <div aria-hidden className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        <div aria-hidden className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-oak/10 blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oak-600 mb-4">Contact us</p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Get in touch
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Have a question, need a quote, or want to join our panel? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Form + info */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Info */}
            <aside className="lg:col-span-5 space-y-6">
              <div className="bg-warm-50 border border-warm-200 rounded-3xl p-7 sm:p-8 shadow-soft">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground mb-5">
                  Reach us directly
                </h2>
                <ul className="space-y-5">
                  {CONTACTS.map(({ Icon, label, value, href }) => (
                    <li key={label} className="flex gap-4">
                      <div className="shrink-0 w-11 h-11 rounded-xl bg-oak-500/10 border border-oak-500/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-oak-600" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-0.5">{label}</p>
                        {href ? (
                          <a href={href} className="text-sm text-foreground hover:text-oak-600 transition-colors break-all">{value}</a>
                        ) : (
                          <p className="text-sm text-foreground">{value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-ink-900 text-warm-50 rounded-3xl p-7 sm:p-8 shadow-lifted">
                <ShieldCheck className="w-6 h-6 text-oak-500 mb-4" />
                <p className="text-warm-50/80 text-sm leading-relaxed mb-5">
                  Need a quote? Fill in the form, use our online chatbot, or contact us at{" "}
                  <a href="mailto:info@completemyproject.co.uk" className="underline hover:text-oak-500">info@completemyproject.co.uk</a>.
                </p>
                <Link
                  to="/get-quotes"
                  className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
                >
                  Get a free quote <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="bg-warm-50 border border-warm-200 rounded-3xl p-7 sm:p-10 shadow-soft" noValidate>
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare className="w-5 h-5 text-oak-600" />
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Send us a message</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <Field label="Full name" required error={errors.name}>
                  <input
                      maxLength={100}
                      placeholder="e.g. John Smith"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-card border border-warm-200 rounded-xl outline-none focus:border-oak-500 transition-colors"
                    />
                  </Field>
                  <Field label="Email" required error={errors.email}>
                  <input
                      type="email"
                      maxLength={255}
                      placeholder="e.g. john@example.com"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      className={`w-full px-4 py-3 text-sm bg-card border rounded-xl outline-none focus:border-oak-500 transition-colors ${errors.email ? "border-destructive" : "border-warm-200"}`}
                    />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <Field label="Phone (optional)" error={errors.phone}>
                  <input
                      type="tel"
                      maxLength={30}
                      placeholder="e.g. 07700 900123"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-card border border-warm-200 rounded-xl outline-none focus:border-oak-500 transition-colors"
                    />
                  </Field>
                  <Field label="Topic">
                    <select
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-card border border-warm-200 rounded-xl outline-none focus:border-oak-500 transition-colors"
                    >
                      {TOPICS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Message" required error={errors.message}>
                  <textarea
                    rows={5}
                    maxLength={2000}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-card border border-warm-200 rounded-xl outline-none focus:border-oak-500 transition-colors resize-none"
                    placeholder="Tell us a little about what you need…"
                  />
                </Field>

                <div className="mt-4 mb-6">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <Checkbox
                      checked={form.agreeToPrivacy}
                      onCheckedChange={(checked) => {
                        setForm({ ...form, agreeToPrivacy: checked === true });
                        if (errors.agreeToPrivacy) setErrors((prev) => ({ ...prev, agreeToPrivacy: "" }));
                      }}
                      className="mt-0.5"
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      By submitting, you agree to our <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>. We'll never share your details with anyone outside our vetted panel.
                    </span>
                  </label>
                  {errors.agreeToPrivacy && <span className="block mt-1.5 text-xs text-destructive">{errors.agreeToPrivacy}</span>}
                </div>

                <div className="mb-6">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <Checkbox
                      checked={form.marketingOptIn}
                      onCheckedChange={(checked) => setForm({ ...form, marketingOptIn: checked === true })}
                      className="mt-0.5"
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      By ticking this box, you agree to receive marketing communications from{" "}
                      <a href="https://completemyproject.co.uk" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-accent/80 font-medium">completemyproject.co.uk</a>
                      {" "}and selected third-party partners. Your data may be shared with these partners.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-60 text-accent-foreground font-semibold text-sm px-7 py-3.5 rounded-full transition-colors"
                >
                  {submitting ? "Sending…" : "Send message"}
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
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
