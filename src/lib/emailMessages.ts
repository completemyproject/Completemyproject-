import { ADMIN_EMAIL, EMAIL_COPY } from "@/constants/email";

export type EmailMail = {
  to: string;
  subject: string;
  message: string;
  /** Submitter / customer name (EmailJS {{name}}) */
  name: string;
  /** Short summary (EmailJS {{request}}) */
  request: string;
  /** Customer email for admin alerts */
  submitterEmail?: string;
};

export type EmailPayload = {
  user?: EmailMail;
  admin?: Omit<EmailMail, "to"> & { to?: string };
};

export function buildAccountPendingReview(data: {
  email: string;
  contactName: string;
  businessName: string;
  phone?: string;
  businessType?: string;
}): EmailPayload {
  return {
    user: {
      to: data.email,
      subject: EMAIL_COPY.accountPendingReview.user.subject,
      message: EMAIL_COPY.accountPendingReview.user.plain(data.contactName, data.businessName),
      name: data.contactName,
      request: "Trades account application",
      submitterEmail: data.email,
    },
    admin: {
      subject: EMAIL_COPY.accountPendingReview.admin.subject(data.businessName),
      name: data.contactName,
      request: `New trades account — ${data.businessName}`,
      submitterEmail: data.email,
      message: EMAIL_COPY.accountPendingReview.admin.plain({
        businessName: data.businessName,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone,
        reviewUrl: `${window.location.origin}/admin?tab=applications`,
      }),
    },
  };
}

export function buildAccountApproved(data: {
  email: string;
  contactName: string;
  businessName: string;
}): EmailPayload {
  const loginUrl = `${window.location.origin}/trades-login`;
  return {
    user: {
      to: data.email,
      subject: EMAIL_COPY.accountApproved.user.subject,
      message: EMAIL_COPY.accountApproved.user.plain(data.contactName, data.businessName, loginUrl),
      name: data.contactName,
      request: "Account approved",
      submitterEmail: data.email,
    },
  };
}

export function buildAccountRejected(data: {
  email: string;
  contactName: string;
  businessName: string;
}): EmailPayload {
  return {
    user: {
      to: data.email,
      subject: EMAIL_COPY.accountRejected.user.subject,
      message: EMAIL_COPY.accountRejected.user.plain(data.contactName, data.businessName),
      name: data.contactName,
      request: "Account application update",
      submitterEmail: data.email,
    },
  };
}

export function buildTradeJobCreated(data: {
  businessName: string;
  contractorEmail: string;
  customerName: string;
  postcode: string;
  status: string;
  inspectionDate?: string;
  comments?: string;
}): EmailPayload {
  return {
    admin: {
      subject: EMAIL_COPY.tradeJobCreated.admin.subject(data.businessName),
      name: data.businessName,
      request: `New job — ${data.customerName}`,
      submitterEmail: data.contractorEmail,
      message: EMAIL_COPY.tradeJobCreated.admin.plain({
        businessName: data.businessName,
        contractorEmail: data.contractorEmail,
        customerName: data.customerName,
        postcode: data.postcode,
        status: data.status,
        reviewUrl: `${window.location.origin}/admin?tab=jobs`,
      }),
    },
  };
}

export function buildQuoteSubmitted(data: {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  postcode: string;
  description: string;
}): EmailPayload {
  return {
    user: {
      to: data.email,
      subject: EMAIL_COPY.quoteSubmitted.user.subject,
      message: EMAIL_COPY.quoteSubmitted.user.plain(data.name, data.projectType, data.postcode),
      name: data.name,
      request: `Quote — ${data.projectType}`,
      submitterEmail: data.email,
    },
    admin: {
      subject: EMAIL_COPY.quoteSubmitted.admin.subject(data.projectType, data.postcode),
      name: data.name,
      request: `Quote request — ${data.projectType} (${data.postcode})`,
      submitterEmail: data.email,
      message: EMAIL_COPY.quoteSubmitted.admin.plain({
        ...data,
        reviewUrl: `${window.location.origin}/admin?tab=quotes`,
      }),
    },
  };
}

export function buildContactSubmitted(data: {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
}): EmailPayload {
  return {
    user: {
      to: data.email,
      subject: EMAIL_COPY.contactSubmitted.user.subject,
      message: EMAIL_COPY.contactSubmitted.user.plain(data.name, data.topic),
      name: data.name,
      request: data.topic,
      submitterEmail: data.email,
    },
    admin: {
      subject: EMAIL_COPY.contactSubmitted.admin.subject(data.topic),
      name: data.name,
      request: `Contact — ${data.topic}`,
      submitterEmail: data.email,
      message: EMAIL_COPY.contactSubmitted.admin.plain({
        ...data,
        reviewUrl: `${window.location.origin}/admin?tab=contact`,
      }),
    },
  };
}

export function buildPartnershipSubmitted(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  partnerType: string;
  message: string;
}): EmailPayload {
  return {
    user: {
      to: data.email,
      subject: EMAIL_COPY.partnershipSubmitted.user.subject,
      message: EMAIL_COPY.partnershipSubmitted.user.plain(data.name, data.partnerType, data.company),
      name: data.name,
      request: `Partnership — ${data.partnerType}`,
      submitterEmail: data.email,
    },
    admin: {
      subject: EMAIL_COPY.partnershipSubmitted.admin.subject(data.company),
      name: data.name,
      request: `Partnership — ${data.company}`,
      submitterEmail: data.email,
      message: EMAIL_COPY.partnershipSubmitted.admin.plain({
        ...data,
        reviewUrl: `${window.location.origin}/admin?tab=partnerships`,
      }),
    },
  };
}

export { ADMIN_EMAIL };
