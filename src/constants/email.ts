
export const ADMIN_EMAIL =
  import.meta.env.VITE_EMAILJS_ADMIN_EMAIL ?? "zubair520548ahm@gmail.com";

export const ADMIN_EMAILS: readonly string[] = [ADMIN_EMAIL];

export const BRAND_NAME    = "Complete My Project";
export const SUPPORT_EMAIL = "info@completemyproject.co.uk";
export const DEFAULT_APP_URL = "https://completemyproject.co.uk";

export const EMAIL_COPY = {

  // ── Trades sign-up ───────────────────────────────────────────────────────
  accountPendingReview: {
    user: {
      subject: "Application under review",
      plain: (_contactName: string, businessName: string) =>
      `Thank you for applying to join ${BRAND_NAME} as a registered trades professional.

We have received your application for ${businessName} and our team is currently reviewing your details. You can expect to hear from us within 2–3 business days.

Once reviewed, you will receive a confirmation email letting you know whether your account has been approved. If we need any additional information, we will be in touch.`,
    },
    admin: {
      subject: (businessName: string) => `New account to review — ${businessName}`,
      plain: (p: {
        businessName: string;
        contactName: string;
        email: string;
        phone?: string;
        reviewUrl: string;
      }) =>
        `ACTION REQUIRED — New Trades Account Application

Business:  ${p.businessName}
Contact:   ${p.contactName}
Email:     ${p.email}${p.phone ? `\nPhone:     ${p.phone}` : ""}

Review this application:
${p.reviewUrl}`,
    },
  },

  // ── Account approved ─────────────────────────────────────────────────────
  accountApproved: {
    user: {
      subject: "Account approved — welcome to Complete My Project",
      plain: (_contactName: string, businessName: string, loginUrl: string) =>
        `Congratulations! Your trades account for ${businessName} has been approved.

You can now log in to your dashboard to start adding jobs, managing your profile, and connecting with customers.

Log in here: ${loginUrl}

Welcome to the ${BRAND_NAME} community — we look forward to working with you.`,
    },
  },

  // ── Account rejected ─────────────────────────────────────────────────────
  accountRejected: {
    user: {
      subject: "Update on your trades account application",
      plain: (_contactName: string, businessName: string) =>
        `Thank you for taking the time to apply to ${BRAND_NAME}.

After carefully reviewing your application for ${businessName}, we are unable to approve your account at this time.

We appreciate your interest and wish you all the best.`,
    },
  },

  // ── Trade job added ──────────────────────────────────────────────────────
  tradeJobCreated: {
    admin: {
      subject: (businessName: string) => `New trade job added — ${businessName}`,
      plain: (p: {
        businessName: string;
        contractorEmail: string;
        customerName: string;
        postcode: string;
        status: string;
        reviewUrl: string;
      }) =>
        `NEW TRADE JOB ADDED

Contractor: ${p.businessName}
Email:      ${p.contractorEmail}
Customer:   ${p.customerName}
Postcode:   ${p.postcode}
Status:     ${p.status}

View in admin dashboard:
${p.reviewUrl}`,
    },
  },

  // ── Get Quotes submitted ─────────────────────────────────────────────────
  quoteSubmitted: {
    user: {
      subject: "We've received your quote request",
      plain: (_name: string, projectType: string, postcode: string) =>
        `Thank you for your quote request — we have received your project details and our network of vetted tradespeople will be in touch shortly.

Project:  ${projectType}
Location: ${postcode}

You can expect to receive up to 3 competitive quotes within 24 hours. All tradespeople on our platform are fully vetted and reviewed.`,
    },
    admin: {
      subject: (projectType: string, postcode: string) =>
        `New quote request — ${projectType} (${postcode})`,
      plain: (p: {
        name: string;
        email: string;
        phone: string;
        projectType: string;
        postcode: string;
        description: string;
        reviewUrl: string;
      }) =>
        `NEW QUOTE REQUEST

Name:     ${p.name}
Email:    ${p.email}
Phone:    ${p.phone}
Project:  ${p.projectType}
Postcode: ${p.postcode}

Description:
${p.description}

View in admin dashboard:
${p.reviewUrl}`,
    },
  },

  // ── Contact form ─────────────────────────────────────────────────────────
  contactSubmitted: {
    user: {
      subject: "We've received your message",
      plain: (_name: string, topic: string) =>
        `Thank you for getting in touch with ${BRAND_NAME}.

We have received your message regarding "${topic}" and a member of our team will get back to you within one working day.`,
    },
    admin: {
      subject: (topic: string) => `New contact message — ${topic}`,
      plain: (p: {
        name: string;
        email: string;
        topic: string;
        phone?: string;
        message: string;
        reviewUrl: string;
      }) =>
        `NEW CONTACT MESSAGE

From:  ${p.name}
Email: ${p.email}${p.phone ? `\nPhone: ${p.phone}` : ""}
Topic: ${p.topic}

Message:
${p.message}

View in admin dashboard:
${p.reviewUrl}`,
    },
  },

  // ── Partnership form ─────────────────────────────────────────────────────
  partnershipSubmitted: {
    user: {
      subject: "Partnership application received",
      plain: (_name: string, partnerType: string, company: string) =>
        `Thank you for your interest in partnering with ${BRAND_NAME}.

We have received your application for ${company} as a ${partnerType} partner. Our partnerships team will review your submission and be in touch within one working day.

We look forward to exploring how we can work together.`,
    },
    admin: {
      subject: (company: string) => `New partnership application — ${company}`,
      plain: (p: {
        name: string;
        email: string;
        phone: string;
        company: string;
        partnerType: string;
        message: string;
        reviewUrl: string;
      }) =>
        `NEW PARTNERSHIP APPLICATION

Name:    ${p.name}
Email:   ${p.email}
Phone:   ${p.phone}
Company: ${p.company}
Type:    ${p.partnerType}

Message:
${p.message}

View in admin dashboard:
${p.reviewUrl}`,
    },
  },

} as const;
