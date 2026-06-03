import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ContactMessage = Tables<"contact_messages">;

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export function messageBody(value: unknown): string {
  const text = normalizeMessageField(value);
  return text || "—";
}

function asText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

export function isPartnershipMessage(msg: ContactMessage): boolean {
  return asText(msg.topic).toLowerCase().startsWith("partnership");
}

export function partnershipTypeFromTopic(topic: unknown): string {
  const text = asText(topic);
  const prefix = "Partnership — ";
  if (text.startsWith(prefix)) return text.slice(prefix.length);
  return text.replace(/^partnership\s*—?\s*/i, "") || "—";
}

function normalizeMessageField(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "object" && !Array.isArray(value) && "message" in value) {
    return asText((value as { message: unknown }).message);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("{") && trimmed.includes('"message"')) {
      try {
        const parsed = JSON.parse(trimmed) as { message?: unknown };
        if (parsed.message != null) return asText(parsed.message);
      } catch {
        // not JSON — use raw string
      }
    }
    return value;
  }
  return asText(value);
}

export function companyFromPartnershipMessage(message: unknown): string {
  const text = normalizeMessageField(message);
  const match = text.match(/^Company:\s*(.+?)(?:\n\n|$)/m);
  return match ? match[1].trim() : "—";
}

export function bodyFromPartnershipMessage(message: unknown): string {
  const text = normalizeMessageField(message);
  if (!text) return "—";
  const parts = text.split("\n\n");
  if (parts.length > 1) return parts.slice(1).join("\n\n").trim() || "—";
  const stripped = text.replace(/^Company:\s*.+\n?/m, "").trim();
  return stripped || "—";
}

export function partnershipMessageBody(msg: ContactMessage): string {
  return bodyFromPartnershipMessage(msg.message);
}
