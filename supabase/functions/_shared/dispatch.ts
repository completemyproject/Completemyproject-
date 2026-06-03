import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getAdminEmails } from "./admin.ts";
import { sendMail, sendMailToMany, testSmtpConnection } from "./smtp.ts";
import * as templates from "./templates.ts";

export type EmailType =
  | "smtp_test"
  | "account_pending_review"
  | "account_approved"
  | "account_rejected"
  | "trade_job_created"
  | "quote_submitted"
  | "contact_submitted"
  | "partnership_submitted";

export type EmailPayload = {
  type: EmailType;
  data: Record<string, unknown>;
};

function asString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing or invalid field: ${field}`);
  }
  return value.trim();
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export async function dispatchEmail(payload: EmailPayload): Promise<{ sent: number }> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const adminEmails = await getAdminEmails(supabase);
  if (adminEmails.length === 0) {
    console.warn("No admin emails configured (ADMIN_EMAIL or admin user_roles)");
  }

  let sent = 0;
  const { type, data } = payload;

  switch (type) {
    case "smtp_test": {
      const result = await testSmtpConnection();
      return { sent: 1, ...result };
    }

    case "account_pending_review": {
      const userEmail = asString(data.email, "email");
      const contactName = asString(data.contactName, "contactName");
      const businessName = asString(data.businessName, "businessName");
      const userContent = templates.accountPendingReviewUser({ contactName, businessName });
      await sendMail({ to: userEmail, ...userContent });
      sent += 1;

      if (adminEmails.length) {
        const adminContent = templates.accountPendingReviewAdmin({
          businessName,
          contactName,
          email: userEmail,
          phone: optionalString(data.phone),
          businessType: optionalString(data.businessType),
        });
        await sendMail({ to: adminEmails, ...adminContent });
        sent += adminEmails.length;
      }
      break;
    }

    case "account_approved": {
      const userEmail = asString(data.email, "email");
      const contactName = asString(data.contactName, "contactName");
      const businessName = asString(data.businessName, "businessName");
      const content = templates.accountApprovedUser({ contactName, businessName });
      await sendMail({ to: userEmail, ...content });
      sent += 1;
      break;
    }

    case "account_rejected": {
      const userEmail = asString(data.email, "email");
      const contactName = asString(data.contactName, "contactName");
      const businessName = asString(data.businessName, "businessName");
      const content = templates.accountRejectedUser({ contactName, businessName });
      await sendMail({ to: userEmail, ...content });
      sent += 1;
      break;
    }

    case "trade_job_created": {
      if (!adminEmails.length) break;
      const content = templates.tradeJobCreatedAdmin({
        businessName: asString(data.businessName, "businessName"),
        contractorEmail: asString(data.contractorEmail, "contractorEmail"),
        customerName: asString(data.customerName, "customerName"),
        postcode: asString(data.postcode, "postcode"),
        status: asString(data.status, "status"),
        inspectionDate: optionalString(data.inspectionDate),
        comments: optionalString(data.comments),
      });
      await sendMail({ to: adminEmails, ...content });
      sent += adminEmails.length;
      break;
    }

    case "quote_submitted": {
      const name = asString(data.name, "name");
      const email = asString(data.email, "email");
      const phone = asString(data.phone, "phone");
      const projectType = asString(data.projectType, "projectType");
      const postcode = asString(data.postcode, "postcode");
      const description = asString(data.description, "description");

      const enquiryId = optionalString(data.enquiryId);
      if (enquiryId) {
        const { data: enquiry, error } = await supabase
          .from("enquiries")
          .select("id")
          .eq("id", enquiryId)
          .maybeSingle();
        if (error || !enquiry) {
          throw new Error("Invalid enquiry reference");
        }
      }

      const userContent = templates.quoteSubmittedUser({ name, projectType, postcode });
      const adminContent = templates.quoteSubmittedAdmin({
        name,
        email,
        phone,
        projectType,
        postcode,
        description,
      });

      await sendMailToMany([
        { to: email, ...userContent },
        ...(adminEmails.length ? [{ to: adminEmails, ...adminContent }] : []),
      ]);
      sent += 1 + adminEmails.length;
      break;
    }

    case "contact_submitted": {
      const name = asString(data.name, "name");
      const email = asString(data.email, "email");
      const topic = asString(data.topic, "topic");
      const message = asString(data.message, "message");
      const phone = optionalString(data.phone);

      const userContent = templates.contactSubmittedUser({ name, topic });
      const adminContent = templates.contactSubmittedAdmin({
        name,
        email,
        phone,
        topic,
        message,
      });

      await sendMailToMany([
        { to: email, ...userContent },
        ...(adminEmails.length ? [{ to: adminEmails, ...adminContent }] : []),
      ]);
      sent += 1 + adminEmails.length;
      break;
    }

    case "partnership_submitted": {
      const name = asString(data.name, "name");
      const email = asString(data.email, "email");
      const phone = asString(data.phone, "phone");
      const company = asString(data.company, "company");
      const partnerType = asString(data.partnerType, "partnerType");
      const message = asString(data.message, "message");

      const userContent = templates.partnershipSubmittedUser({ name, partnerType, company });
      const adminContent = templates.partnershipSubmittedAdmin({
        name,
        email,
        phone,
        company,
        partnerType,
        message,
      });

      await sendMailToMany([
        { to: email, ...userContent },
        ...(adminEmails.length ? [{ to: adminEmails, ...adminContent }] : []),
      ]);
      sent += 1 + adminEmails.length;
      break;
    }

    default:
      throw new Error(`Unknown email type: ${type}`);
  }

  return { sent };
}
