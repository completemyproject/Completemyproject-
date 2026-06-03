import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ADMIN_EMAILS, DEFAULT_APP_URL } from "./emailConstants.ts";

export async function getAdminEmails(supabase: SupabaseClient): Promise<string[]> {
  const fromConstants = ADMIN_EMAILS.map((e) => e.trim().toLowerCase()).filter(Boolean);
  const fromEnv = (Deno.env.get("ADMIN_EMAIL") || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const emails = new Set<string>([...fromConstants, ...fromEnv]);

  try {
    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (rolesError || !roles?.length) {
      return [...emails];
    }

    let page = 1;
    const perPage = 200;

    while (true) {
      const { data: usersPage, error: usersError } = await supabase.auth.admin.listUsers({
        page,
        perPage,
      });

      if (usersError || !usersPage?.users?.length) break;

      const adminIds = new Set(roles.map((r) => r.user_id));
      for (const user of usersPage.users) {
        if (adminIds.has(user.id) && user.email) {
          emails.add(user.email.toLowerCase());
        }
      }

      if (usersPage.users.length < perPage) break;
      page += 1;
    }
  } catch (err) {
    console.error("getAdminEmails:", err);
  }

  return [...emails];
}

export function appBaseUrl(): string {
  return (Deno.env.get("APP_URL") || DEFAULT_APP_URL).replace(/\/$/, "");
}

export function adminDashboardUrl(tab?: string): string {
  const base = `${appBaseUrl()}/admin`;
  return tab ? `${base}?tab=${tab}` : base;
}
