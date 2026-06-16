import { useState } from "react";
import { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notifyReferralSubmitted } from "@/lib/emailService";

const referralSchema = z.object({
  referrerName: z.string().trim().min(2, "Please enter your name").max(100),
  referrerEmail: z.string().trim().min(1, "Email is required").email("Please enter a valid email").max(255),
  clientName: z.string().trim().min(2, "Please enter your client's name").max(100),
  clientEmail: z.string().trim().min(1, "Client email is required").email("Please enter a valid email").max(255),
  clientPhone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
});

const EMPTY_FORM = {
  referrerName: "",
  referrerEmail: "",
  clientName: "",
  clientEmail: "",
  clientPhone: "",
};

export default function ReferAFriendDialog({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(EMPTY_FORM);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = referralSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("referrals").insert({
      referrer_name: parsed.data.referrerName,
      referrer_email: parsed.data.referrerEmail,
      client_name: parsed.data.clientName,
      client_email: parsed.data.clientEmail,
      client_phone: parsed.data.clientPhone,
    });

    if (error) {
      setSubmitting(false);
      toast({ title: "Couldn't submit your referral", description: "Please try again or email us directly.", variant: "destructive" });
      return;
    }

    try {
      await notifyReferralSubmitted({
        referrerName: parsed.data.referrerName,
        referrerEmail: parsed.data.referrerEmail,
        clientName: parsed.data.clientName,
        clientEmail: parsed.data.clientEmail,
        clientPhone: parsed.data.clientPhone,
      });
    } catch (err) {
      console.error("[referral] notify failed:", err);
    }

    setSubmitting(false);
    toast({ title: "Referral submitted", description: "Thanks! We'll review it and be in touch." });
    setForm(EMPTY_FORM);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setErrors({});
          setForm(EMPTY_FORM);
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg bg-card border-warm-200 rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-extrabold tracking-tight text-foreground">
            Refer a friend
          </DialogTitle>
          <DialogDescription>
            Tell us about your friend's project and we'll be in touch with them.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Your name" required error={errors.referrerName}>
              <input
                maxLength={100}
                placeholder="e.g. Jane Doe"
                value={form.referrerName}
                onChange={(e) => setForm({ ...form, referrerName: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-warm-50 border border-warm-200 rounded-xl outline-none focus:border-oak-500 transition-colors"
              />
            </Field>
            <Field label="Your email" required error={errors.referrerEmail}>
              <input
                type="email"
                maxLength={255}
                placeholder="e.g. jane@example.com"
                value={form.referrerEmail}
                onChange={(e) => setForm({ ...form, referrerEmail: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-warm-50 border border-warm-200 rounded-xl outline-none focus:border-oak-500 transition-colors"
              />
            </Field>
          </div>

          <div className="border-t border-warm-200 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Your friend's details
            </p>
            <div className="space-y-4">
              <Field label="Client name" required error={errors.clientName}>
                <input
                  maxLength={100}
                  placeholder="e.g. John Smith"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-warm-50 border border-warm-200 rounded-xl outline-none focus:border-oak-500 transition-colors"
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Client email" required error={errors.clientEmail}>
                  <input
                    type="email"
                    maxLength={255}
                    placeholder="e.g. john@example.com"
                    value={form.clientEmail}
                    onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-warm-50 border border-warm-200 rounded-xl outline-none focus:border-oak-500 transition-colors"
                  />
                </Field>
                <Field label="Client phone" required error={errors.clientPhone}>
                  <input
                    type="tel"
                    maxLength={30}
                    placeholder="e.g. 07700 900123"
                    value={form.clientPhone}
                    onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-warm-50 border border-warm-200 rounded-xl outline-none focus:border-oak-500 transition-colors"
                  />
                </Field>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-60 text-accent-foreground font-semibold text-sm px-7 py-3.5 rounded-full transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
              </>
            ) : (
              <>
                Submit referral <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
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
