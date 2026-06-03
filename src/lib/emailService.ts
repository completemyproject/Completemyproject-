import emailjs from "@emailjs/browser";
import { ADMIN_EMAIL, BRAND_NAME } from "@/constants/email";
import type { EmailMail, EmailPayload } from "@/lib/emailMessages";
import {
  buildAccountPendingReview,
  buildAccountApproved,
  buildAccountRejected,
  buildTradeJobCreated,
  buildQuoteSubmitted,
  buildContactSubmitted,
  buildPartnershipSubmitted,
} from "@/lib/emailMessages";

export { ADMIN_EMAIL, ADMIN_EMAILS, BRAND_NAME, EMAIL_COPY } from "@/constants/email";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "";
const TEMPLATE_USER = import.meta.env.VITE_EMAILJS_TEMPLATE_USER ?? "";
const TEMPLATE_ADMIN =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN ?? TEMPLATE_USER;

function isConfigured(): boolean {
  return Boolean(SERVICE_ID && PUBLIC_KEY && TEMPLATE_USER);
}

function templateParams(mail: EmailMail, recipient: string): Record<string, string> {
  const to = recipient.trim();
  if (!to) throw new Error("Recipient email is empty");

  const name = mail.name.trim() || "Customer";
  const request = mail.request.trim() || mail.subject;
  const submitterEmail = mail.submitterEmail?.trim() ?? "";

  return {
    to_email: to,
    email: to,
    user_email: to,
    to,
    recipient: to,
    subject: mail.subject,
    message: mail.message,
    body: mail.message,
    content: mail.message,
    name,
    user_name: name,
    first_name: name.split(/\s+/)[0] || name,
    from_name: name,
    request,
    title: mail.subject,
    company_name: BRAND_NAME,
    submitter_email: submitterEmail,
    reply_to: submitterEmail || ADMIN_EMAIL,
    admin_email: ADMIN_EMAIL,
  };
}

async function sendViaTemplate(templateId: string, mail: EmailMail, recipient: string): Promise<void> {
  await emailjs.send(SERVICE_ID, templateId, templateParams(mail, recipient), {
    publicKey: PUBLIC_KEY,
  });
}

async function sendUserMail(mail: EmailMail): Promise<void> {
  await sendViaTemplate(TEMPLATE_USER, mail, mail.to);
}

async function sendAdminMail(mail: Omit<EmailMail, "to"> & { to?: string }): Promise<void> {
  const adminMail: EmailMail = { ...mail, to: mail.to ?? ADMIN_EMAIL };
  await sendViaTemplate(TEMPLATE_ADMIN, adminMail, ADMIN_EMAIL);
}

async function dispatchPayload(payload: EmailPayload): Promise<void> {
  if (!isConfigured()) {
    console.warn(
      "[email] EmailJS not configured. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_TEMPLATE_USER to .env",
    );
    return;
  }

  const tasks: Promise<void>[] = [];
  if (payload.user) tasks.push(sendUserMail(payload.user));
  if (payload.admin) tasks.push(sendAdminMail(payload.admin));
  await Promise.all(tasks);
}

function send(payload: EmailPayload): void {
  void dispatchPayload(payload).catch((err) => {
    console.error("[email] send failed:", err);
  });
}

export function notifyAccountPendingReview(data: {
  email: string;
  contactName: string;
  businessName: string;
  phone?: string;
  businessType?: string;
}): void {
  send(buildAccountPendingReview(data));
}

export function notifyAccountApproved(data: {
  email: string;
  contactName: string;
  businessName: string;
}): void {
  send(buildAccountApproved(data));
}

export function notifyAccountRejected(data: {
  email: string;
  contactName: string;
  businessName: string;
}): void {
  send(buildAccountRejected(data));
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
  send(buildTradeJobCreated(data));
}

export function notifyQuoteSubmitted(data: {
  enquiryId: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  postcode: string;
  description: string;
}): void {
  send(buildQuoteSubmitted(data));
}

export function notifyContactSubmitted(data: {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
}): void {
  send(buildContactSubmitted(data));
}

export function notifyPartnershipSubmitted(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  partnerType: string;
  message: string;
}): void {
  send(buildPartnershipSubmitted(data));
}
