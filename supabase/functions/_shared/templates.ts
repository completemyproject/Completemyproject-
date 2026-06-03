import { adminDashboardUrl, appBaseUrl } from "./admin.ts";
import { BRAND_NAME, EMAIL_COPY, EMAIL_FOOTER } from "./emailConstants.ts";

function layout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f5f3ef;font-family:system-ui,-apple-system,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;border:1px solid #e8e4dc;overflow:hidden;">
        <tr><td style="background:#1e3a4a;padding:24px 28px;">
          <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">${BRAND_NAME}</p>
        </td></tr>
        <tr><td style="padding:28px;">${bodyHtml}</td></tr>
        <tr><td style="padding:16px 28px 24px;border-top:1px solid #e8e4dc;font-size:12px;color:#6b7280;">
          ${EMAIL_FOOTER}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function p(text: string): string {
  return `<p style="margin:0 0 16px;line-height:1.6;font-size:15px;">${text}</p>`;
}

function btn(href: string, label: string): string {
  return `<p style="margin:24px 0 8px;"><a href="${href}" style="display:inline-block;background:#2d9d8f;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">${label}</a></p>`;
}

function details(rows: Record<string, string>): string {
  const items = Object.entries(rows)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;font-size:13px;color:#6b7280;vertical-align:top;">${k}</td><td style="padding:8px 0;font-size:14px;font-weight:500;">${v}</td></tr>`,
    )
    .join("");
  return `<table style="width:100%;margin:16px 0 20px;border-collapse:collapse;">${items}</table>`;
}

export type EmailContent = { subject: string; text: string; html: string };

export function accountPendingReviewUser(params: {
  contactName: string;
  businessName: string;
}): EmailContent {
  const copy = EMAIL_COPY.accountPendingReview.user;
  const subject = copy.subject;
  const text = copy.plain(params.contactName, params.businessName);
  const html = layout(
    subject,
    `${p(`Hi <strong>${params.contactName}</strong>,`)}
     ${p(copy.htmlIntro(params.contactName, params.businessName))}
     ${p(copy.htmlBody)}`,
  );
  return { subject, text, html };
}

export function accountPendingReviewAdmin(params: {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  businessType?: string;
}): EmailContent {
  const copy = EMAIL_COPY.accountPendingReview.admin;
  const reviewUrl = adminDashboardUrl("applications");
  const subject = copy.subject(params.businessName);
  const text = copy.plain({
    businessName: params.businessName,
    contactName: params.contactName,
    email: params.email,
    phone: params.phone,
    reviewUrl,
  });
  const html = layout(
    subject,
    `${p(`<strong>${copy.htmlLead}</strong>`)}
     ${details({
       Business: params.businessName,
       Contact: params.contactName,
       Email: params.email,
       Phone: params.phone || "—",
       Type: params.businessType || "—",
     })}
     ${btn(reviewUrl, copy.buttonLabel)}`,
  );
  return { subject, text, html };
}

export function accountApprovedUser(params: {
  contactName: string;
  businessName: string;
}): EmailContent {
  const copy = EMAIL_COPY.accountApproved.user;
  const loginUrl = `${appBaseUrl()}/trades-login`;
  const subject = copy.subject;
  const text = copy.plain(params.contactName, params.businessName, loginUrl);
  const html = layout(
    subject,
    `${p(`Hi <strong>${params.contactName}</strong>,`)}
     ${p(copy.htmlBody(params.businessName))}
     ${btn(loginUrl, copy.buttonLabel)}`,
  );
  return { subject, text, html };
}

export function accountRejectedUser(params: {
  contactName: string;
  businessName: string;
}): EmailContent {
  const copy = EMAIL_COPY.accountRejected.user;
  const subject = copy.subject;
  const text = copy.plain(params.contactName, params.businessName);
  const html = layout(
    subject,
    `${p(`Hi <strong>${params.contactName}</strong>,`)}
     ${p(copy.htmlBody(params.businessName))}
     ${p(copy.htmlContact)}`,
  );
  return { subject, text, html };
}

export function tradeJobCreatedAdmin(params: {
  businessName: string;
  contractorEmail: string;
  customerName: string;
  postcode: string;
  status: string;
  inspectionDate?: string;
  comments?: string;
}): EmailContent {
  const copy = EMAIL_COPY.tradeJobCreated.admin;
  const reviewUrl = adminDashboardUrl("jobs");
  const subject = copy.subject(params.businessName);
  const text = copy.plain({
    businessName: params.businessName,
    contractorEmail: params.contractorEmail,
    customerName: params.customerName,
    postcode: params.postcode,
    status: params.status,
    reviewUrl,
  });
  const html = layout(
    subject,
    `${p(`<strong>${copy.htmlLead}</strong>`)}
     ${details({
       Contractor: params.businessName,
       Email: params.contractorEmail,
       Customer: params.customerName,
       Postcode: params.postcode,
       Status: params.status,
       "Inspection date": params.inspectionDate || "—",
       Comments: params.comments || "—",
     })}
     ${btn(reviewUrl, copy.buttonLabel)}`,
  );
  return { subject, text, html };
}

export function quoteSubmittedUser(params: {
  name: string;
  projectType: string;
  postcode: string;
}): EmailContent {
  const copy = EMAIL_COPY.quoteSubmitted.user;
  const subject = copy.subject;
  const text = copy.plain(params.name, params.projectType, params.postcode);
  const html = layout(
    subject,
    `${p(`Hi <strong>${params.name}</strong>,`)}
     ${p(copy.htmlIntro)}
     ${details({ Project: params.projectType, Postcode: params.postcode })}
     ${p(copy.htmlQuotes)}`,
  );
  return { subject, text, html };
}

export function quoteSubmittedAdmin(params: {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  postcode: string;
  description: string;
}): EmailContent {
  const copy = EMAIL_COPY.quoteSubmitted.admin;
  const reviewUrl = adminDashboardUrl("quotes");
  const subject = copy.subject(params.projectType, params.postcode);
  const text = copy.plain({ ...params, reviewUrl });
  const html = layout(
    subject,
    `${p(`<strong>${copy.htmlLead}</strong>`)}
     ${details({
       Name: params.name,
       Email: params.email,
       Phone: params.phone,
       Project: params.projectType,
       Postcode: params.postcode,
     })}
     ${p(`<strong>Description:</strong><br><span style="white-space:pre-wrap;">${params.description}</span>`)}
     ${btn(reviewUrl, copy.buttonLabel)}`,
  );
  return { subject, text, html };
}

export function contactSubmittedUser(params: { name: string; topic: string }): EmailContent {
  const copy = EMAIL_COPY.contactSubmitted.user;
  const subject = copy.subject;
  const text = copy.plain(params.name, params.topic);
  const html = layout(
    subject,
    `${p(`Hi <strong>${params.name}</strong>,`)}
     ${p(copy.htmlBody(params.topic))}`,
  );
  return { subject, text, html };
}

export function contactSubmittedAdmin(params: {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
}): EmailContent {
  const copy = EMAIL_COPY.contactSubmitted.admin;
  const reviewUrl = adminDashboardUrl("contact");
  const subject = copy.subject(params.topic);
  const text = copy.plain({ ...params, reviewUrl });
  const html = layout(
    subject,
    `${p(`<strong>${copy.htmlLead}</strong>`)}
     ${details({
       Name: params.name,
       Email: params.email,
       Phone: params.phone || "—",
       Topic: params.topic,
     })}
     ${p(`<strong>Message:</strong><br><span style="white-space:pre-wrap;">${params.message}</span>`)}
     ${btn(reviewUrl, copy.buttonLabel)}`,
  );
  return { subject, text, html };
}

export function partnershipSubmittedUser(params: {
  name: string;
  partnerType: string;
  company: string;
}): EmailContent {
  const copy = EMAIL_COPY.partnershipSubmitted.user;
  const subject = copy.subject;
  const text = copy.plain(params.name, params.partnerType, params.company);
  const html = layout(
    subject,
    `${p(`Hi <strong>${params.name}</strong>,`)}
     ${p(copy.htmlBody(params.partnerType, params.company))}
     ${p(copy.htmlFollowUp)}`,
  );
  return { subject, text, html };
}

export function partnershipSubmittedAdmin(params: {
  name: string;
  email: string;
  phone: string;
  company: string;
  partnerType: string;
  message: string;
}): EmailContent {
  const copy = EMAIL_COPY.partnershipSubmitted.admin;
  const reviewUrl = adminDashboardUrl("partnerships");
  const subject = copy.subject(params.company);
  const text = copy.plain({ ...params, reviewUrl });
  const html = layout(
    subject,
    `${p(`<strong>${copy.htmlLead}</strong>`)}
     ${details({
       Name: params.name,
       Email: params.email,
       Company: params.company,
       Type: params.partnerType,
       Phone: params.phone,
     })}
     ${p(`<strong>Message:</strong><br><span style="white-space:pre-wrap;">${params.message}</span>`)}
     ${btn(reviewUrl, copy.buttonLabel)}`,
  );
  return { subject, text, html };
}
