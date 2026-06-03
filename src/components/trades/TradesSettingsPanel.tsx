import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Building2,
  KeyRound,
  Loader2,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  mapAuthError,
  updateContractorProfile,
  type ContractorProfile,
} from "@/lib/auth";

const profileSchema = z
  .object({
    businessName: z.string().trim().min(2, "Business name is required").max(150),
    companyNumber: z.string().trim().max(50).optional(),
    numberOfDirectors: z.string().trim().optional(),
    contactName: z.string().trim().min(2, "Contact name is required").max(100),
    contactPhone: z.string().trim().max(30).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.numberOfDirectors && !/^\d+$/.test(data.numberOfDirectors)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid number of directors",
        path: ["numberOfDirectors"],
      });
    }
  });

const passwordSchema = z
  .object({
    newPassword: z.string().min(6, "Use at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const inputCls =
  "w-full h-11 px-3.5 rounded-xl border border-warm-200 bg-white text-sm text-ink-900 placeholder:text-ink-500/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition";
const readOnlyCls =
  "w-full h-11 px-3.5 rounded-xl border border-warm-200 bg-warm-50 text-sm text-ink-600 cursor-not-allowed";
const labelCls = "block text-xs font-semibold text-ink-700 mb-1.5";

function formatBusinessType(type: string) {
  return type === "ltd" ? "Ltd company" : type === "sole_trader" ? "Sole trader" : type;
}

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="font-display text-lg font-extrabold text-ink-900 mb-6">{title}</h2>
  );
}

type Props = {
  profile: ContractorProfile;
  onProfileUpdated: (profile: ContractorProfile) => void;
};

function statusLabel(status: ContractorProfile["status"]) {
  if (status === "approved") return "Active";
  if (status === "rejected") return "Not approved";
  return "Pending review";
}

function statusStyle(status: ContractorProfile["status"]) {
  if (status === "approved") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "rejected") return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

export function TradesSettingsPanel({ profile, onProfileUpdated }: Props) {
  const { toast } = useToast();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const isLtd = profile.business_type === "ltd";

  const [profileForm, setProfileForm] = useState({
    businessName: profile.business_name,
    companyNumber: profile.company_number ?? "",
    numberOfDirectors: profile.number_of_directors?.toString() ?? "",
    contactName: profile.contact_name,
    contactPhone: profile.contact_phone ?? "",
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setProfileForm({
      businessName: profile.business_name,
      companyNumber: profile.company_number ?? "",
      numberOfDirectors: profile.number_of_directors?.toString() ?? "",
      contactName: profile.contact_name,
      contactPhone: profile.contact_phone ?? "",
    });
  }, [profile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrors({});

    const parsed = profileSchema.safeParse(profileForm);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (key) fieldErrors[String(key)] = issue.message;
      });
      setProfileErrors(fieldErrors);
      return;
    }

    const directors =
      isLtd && parsed.data.numberOfDirectors
        ? parseInt(parsed.data.numberOfDirectors, 10)
        : isLtd
          ? profile.number_of_directors
          : null;

    setSavingProfile(true);
    const { profile: updated, error } = await updateContractorProfile(profile.user_id, {
      business_name: parsed.data.businessName,
      company_number: parsed.data.companyNumber || null,
      number_of_directors: directors,
      contact_name: parsed.data.contactName,
      contact_phone: parsed.data.contactPhone || null,
    });
    setSavingProfile(false);

    if (error || !updated) {
      toast({
        title: "Could not save profile",
        description: error?.message ?? "Please try again.",
        variant: "destructive",
      });
      return;
    }

    onProfileUpdated(updated);
    toast({ title: "Profile updated", description: "Your account details have been saved." });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});

    const parsed = passwordSchema.safeParse(passwordForm);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (key) fieldErrors[String(key)] = issue.message;
      });
      setPasswordErrors(fieldErrors);
      return;
    }

    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({
      password: parsed.data.newPassword,
    });
    setSavingPassword(false);

    if (error) {
      toast({
        title: "Could not update password",
        description: mapAuthError(error.message),
        variant: "destructive",
      });
      return;
    }

    setPasswordForm({ newPassword: "", confirmPassword: "" });
    toast({ title: "Password updated", description: "Use your new password next time you sign in." });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      <aside className="xl:col-span-1 space-y-4">
        <div className="bg-white rounded-2xl border border-warm-200 shadow-sm p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-extrabold text-ink-900 truncate">
                {profile.business_name}
              </p>
              <p className="text-sm text-ink-500 truncate">{profile.contact_name}</p>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-warm-100 space-y-3">
            <div className="flex items-center gap-2 text-sm text-ink-600">
              <Mail className="w-4 h-4 text-ink-400 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
            {profile.contact_phone && (
              <div className="flex items-center gap-2 text-sm text-ink-600">
                <Phone className="w-4 h-4 text-ink-400 shrink-0" />
                <span>{profile.contact_phone}</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Account status
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle(profile.status)}`}
              >
                {statusLabel(profile.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-ink-900 rounded-2xl p-5 sm:p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Your data
            </p>
          </div>
          <p className="text-sm text-white/80 leading-relaxed">
            Business type is set at sign-up and cannot be changed here. Email changes require
            contacting support.
          </p>
        </div>
      </aside>

      <div className="xl:col-span-2 space-y-6">
        <form
          onSubmit={handleProfileSubmit}
          className="bg-white rounded-2xl border border-warm-200 shadow-sm p-5 sm:p-6 lg:p-8 space-y-8"
        >
          <section>
            <SectionHeading title="Business information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="businessName">
                  Business name
                </label>
                <input
                  id="businessName"
                  className={inputCls}
                  value={profileForm.businessName}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, businessName: e.target.value }))
                  }
                />
                {profileErrors.businessName && (
                  <p className="text-xs text-red-600 mt-1">{profileErrors.businessName}</p>
                )}
              </div>

              <div>
                <label className={labelCls} htmlFor="businessType">
                  Business type
                </label>
                <input
                  id="businessType"
                  className={readOnlyCls}
                  value={formatBusinessType(profile.business_type)}
                  readOnly
                  tabIndex={-1}
                />
                <p className="text-xs text-ink-500 mt-1.5">Set when you applied and cannot be changed.</p>
              </div>

              <div>
                <label className={labelCls} htmlFor="companyNumber">
                  Company number
                </label>
                <input
                  id="companyNumber"
                  className={inputCls}
                  placeholder="Optional"
                  value={profileForm.companyNumber}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, companyNumber: e.target.value }))
                  }
                />
              </div>

              {isLtd && (
                <div className="sm:col-span-2 sm:max-w-xs">
                  <label className={labelCls} htmlFor="numberOfDirectors">
                    Number of directors
                  </label>
                  <input
                    id="numberOfDirectors"
                    type="number"
                    min={1}
                    className={inputCls}
                    placeholder="Optional"
                    value={profileForm.numberOfDirectors}
                    onChange={(e) =>
                      setProfileForm((f) => ({ ...f, numberOfDirectors: e.target.value }))
                    }
                  />
                  {profileErrors.numberOfDirectors && (
                    <p className="text-xs text-red-600 mt-1">{profileErrors.numberOfDirectors}</p>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="pt-8 border-t border-warm-100">
            <SectionHeading title="Contact information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className={labelCls} htmlFor="contactName">
                  Contact name
                </label>
                <input
                  id="contactName"
                  className={inputCls}
                  value={profileForm.contactName}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, contactName: e.target.value }))
                  }
                />
                {profileErrors.contactName && (
                  <p className="text-xs text-red-600 mt-1">{profileErrors.contactName}</p>
                )}
              </div>

              <div>
                <label className={labelCls} htmlFor="contactPhone">
                  Contact number
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  className={inputCls}
                  placeholder="07xxx xxxxxx"
                  value={profileForm.contactPhone}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, contactPhone: e.target.value }))
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="accountEmail">
                  Email address
                </label>
                <input
                  id="accountEmail"
                  type="email"
                  className={readOnlyCls}
                  value={profile.email}
                  readOnly
                  tabIndex={-1}
                  aria-describedby="email-hint"
                />
                <p id="email-hint" className="text-xs text-ink-500 mt-1.5">
                  To change your login email, contact{" "}
                  <a
                    href="mailto:info@completemyproject.co.uk"
                    className="text-accent font-medium hover:underline"
                  >
                    info@completemyproject.co.uk
                  </a>
                </p>
              </div>
            </div>
          </section>

          <div className="pt-6 border-t border-warm-100 flex flex-col sm:flex-row sm:justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-ink-900 hover:bg-ink-700 text-white text-sm font-semibold transition disabled:opacity-60 w-full sm:w-auto"
            >
              {savingProfile ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save changes
            </button>
          </div>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white rounded-2xl border border-warm-200 shadow-sm p-5 sm:p-6 lg:p-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="w-5 h-5 text-accent" />
            <h2 className="font-display text-lg font-extrabold text-ink-900">Security</h2>
          </div>
          <p className="text-sm text-ink-500 mb-6">Update the password you use to sign in.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-xl">
            <div>
              <label className={labelCls} htmlFor="newPassword">
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                className={inputCls}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))
                }
              />
              {passwordErrors.newPassword && (
                <p className="text-xs text-red-600 mt-1">{passwordErrors.newPassword}</p>
              )}
            </div>
            <div>
              <label className={labelCls} htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={inputCls}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))
                }
              />
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">{passwordErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-warm-100 flex flex-col sm:flex-row sm:justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl border border-warm-200 bg-white hover:bg-warm-50 text-ink-900 text-sm font-semibold transition disabled:opacity-60 w-full sm:w-auto"
            >
              {savingPassword ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
              Update password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
