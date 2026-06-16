import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

const APP_URL = (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, "");

export type AppRole = Database["public"]["Enums"]["app_role"];
export type ContractorProfile = Database["public"]["Tables"]["contractor_profiles"]["Row"];
export type ContractorStatus = ContractorProfile["status"];

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function hasRole(userId: string, role: AppRole): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", role)
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST205") {
      console.error("Database not migrated: missing user_roles table. Run supabase/RUN_IN_DASHBOARD.sql");
    } else {
      console.error("hasRole error:", error);
    }
    return false;
  }
  return Boolean(data);
}

/** Creates contractor_profiles + user_roles from auth metadata when missing (e.g. pre-migration signups). */
export async function ensureContractorProfile(): Promise<boolean> {
  const { data, error } = await supabase.rpc("ensure_contractor_profile");
  if (error) {
    if (error.code === "PGRST202") {
      console.error(
        "ensure_contractor_profile RPC missing. Run: npm run db:push — or paste supabase/migrations/20260523140000_ensure_contractor_profile.sql in SQL Editor",
      );
    } else {
      console.error("ensureContractorProfile:", error);
    }
    return false;
  }
  return Boolean(data);
}

export async function resolveContractorAccess(userId: string): Promise<{
  isContractor: boolean;
  profile: ContractorProfile | null;
}> {
  let isContractor = await hasRole(userId, "contractor");
  let profile = await getContractorProfile(userId);

  if (!isContractor || !profile) {
    const repaired = await ensureContractorProfile();
    if (repaired) {
      isContractor = await hasRole(userId, "contractor");
      profile = await getContractorProfile(userId);
    }
  }

  return { isContractor, profile };
}

export type ContractorProfileUpdate = Pick<
  ContractorProfile,
  "business_name" | "company_number" | "number_of_directors" | "contact_name" | "contact_phone"
>;

export async function updateContractorProfile(
  userId: string,
  updates: ContractorProfileUpdate,
): Promise<{ profile: ContractorProfile | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("contractor_profiles")
    .update({
      business_name: updates.business_name.trim(),
      company_number: updates.company_number?.trim() || null,
      number_of_directors: updates.number_of_directors,
      contact_name: updates.contact_name.trim(),
      contact_phone: updates.contact_phone?.trim() || null,
    })
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    return { profile: null, error: new Error(error.message) };
  }
  return { profile: data, error: null };
}

export async function getContractorProfile(userId: string): Promise<ContractorProfile | null> {
  const { data, error } = await supabase
    .from("contractor_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST205") {
      console.error("Database not migrated: missing contractor_profiles. Run supabase/RUN_IN_DASHBOARD.sql");
    } else {
      console.error("getContractorProfile error:", error);
    }
    return null;
  }
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
}

export type ContractorSignupPayload = {
  email: string;
  password: string;
  businessName: string;
  companyNumber?: string;
  businessType: "ltd" | "sole_trader";
  numberOfDirectors?: string;
  contactName: string;
  contactPhone?: string;
};

export async function signUpContractor(payload: ContractorSignupPayload) {
  const email = payload.email.trim().toLowerCase();

  return supabase.auth.signUp({
    email,
    password: payload.password,
    options: {
      emailRedirectTo: `${APP_URL}/trades-login`,
      data: {
        account_type: "contractor",
        business_name: payload.businessName.trim(),
        company_number: payload.companyNumber?.trim() || "",
        business_type: payload.businessType,
        number_of_directors: payload.numberOfDirectors?.trim() || "",
        contact_name: payload.contactName.trim(),
        contact_phone: payload.contactPhone?.trim() || "",
      },
    },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function requestPasswordReset(email: string) {
  return supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${APP_URL}/trades-reset-password`,
  });
}

export async function updatePassword(password: string) {
  return supabase.auth.updateUser({ password });
}

export function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Invalid email or password.";
  if (m.includes("email not confirmed")) return "Please confirm your email before logging in.";
  if (m.includes("user already registered")) return "An account with this email already exists. Try logging in.";
  if (m.includes("password")) return "Password must be at least 6 characters.";
  return message;
}
