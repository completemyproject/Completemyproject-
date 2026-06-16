const EMAIL_API_URL = import.meta.env.VITE_EMAIL_API_URL ?? "http://localhost:4000/email/send";
const EMAIL_API_KEY = import.meta.env.VITE_EMAIL_API_KEY ?? "";

// Send app-generated email payloads to a dedicated nodemailer backend.
// This avoids Supabase function JWT issues and sends emails directly through SMTP.
export type EmailType =
  | "smtp_test"
  | "custom_email"
  | "account_pending_review"
  | "account_approved"
  | "account_rejected"
  | "trade_job_created"
  | "quote_submitted"
  | "contact_submitted"
  | "partnership_submitted"
  | "referral_submitted"
  | "referral_status_updated"
  | "quote_status_updated";

export type EmailFunctionPayload = {
  type: EmailType;
  data: Record<string, unknown>;
};

async function invokeEmailFunction(payload: EmailFunctionPayload): Promise<void> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (EMAIL_API_KEY) {
    headers["Authorization"] = `Bearer ${EMAIL_API_KEY}`;
    headers["x-api-key"] = EMAIL_API_KEY;
  }

  const res = await fetch(EMAIL_API_URL, {
    method: "POST",
    headers,
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  const result = await res.json().catch(() => null);
  if (!res.ok) {
    const message = result?.error || result?.message || res.statusText;
    throw new Error(`Email function request failed: ${message}`);
  }
  if (result?.error) {
    throw new Error(result.error);
  }
}

export async function sendEmailPayload(payload: EmailFunctionPayload): Promise<void> {
  await invokeEmailFunction(payload);
}

export async function smtpTest(): Promise<void> {
  await sendEmailPayload({ type: "smtp_test", data: {} });
}

export async function sendCustomEmail(data: {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}): Promise<void> {
  await sendEmailPayload({ type: "custom_email", data });
}

function safeSendEmail(payload: EmailFunctionPayload): void {
  void invokeEmailFunction(payload).catch((err) => {
    console.error("[email] send-email function failed:", err);
  });
}

export function notifyAccountPendingReview(data: {
  email: string;
  contactName: string;
  businessName: string;
  phone?: string;
  businessType?: string;
}): void {
  safeSendEmail({ type: "account_pending_review", data });
}

export function notifyAccountApproved(data: {
  email: string;
  contactName: string;
  businessName: string;
}): void {
  safeSendEmail({ type: "account_approved", data });
}

export function notifyAccountRejected(data: {
  email: string;
  contactName: string;
  businessName: string;
}): void {
  safeSendEmail({ type: "account_rejected", data });
}

export function notifyTradeJobCreated(data: {
  businessName: string;
  contractorEmail: string;
  customerName: string;
  postcode: string;
  status: string;
  inspectionDate?: string;
  comments?: string;
}): void {
  safeSendEmail({ type: "trade_job_created", data });
}

export async function notifyQuoteSubmitted(data: {
  enquiryId: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  postcode: string;
  description: string;
}): Promise<void> {
  await sendEmailPayload({ type: "quote_submitted", data });
}

export async function notifyContactSubmitted(data: {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
}): Promise<void> {
  await sendEmailPayload({ type: "contact_submitted", data });
}

export async function notifyPartnershipSubmitted(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  partnerType: string;
  message: string;
}): Promise<void> {
  await sendEmailPayload({ type: "partnership_submitted", data });
}

export async function notifyReferralSubmitted(data: {
  referrerName: string;
  referrerEmail: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}): Promise<void> {
  await sendEmailPayload({ type: "referral_submitted", data });
}

export function notifyReferralStatusUpdated(data: {
  referrerName: string;
  referrerEmail: string;
  clientName: string;
  status: string;
}): void {
  safeSendEmail({ type: "referral_status_updated", data });
}

/** Syncs the enquiry's status to the "Status" column in the Google Sheet. */
export function notifyEnquiryStatusUpdated(data: {
  enquiryId: string;
  status: string;
}): void {
  safeSendEmail({ type: "quote_status_updated", data });
}
