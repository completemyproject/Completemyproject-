import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { dispatchEmail, type EmailPayload } from "../_shared/dispatch.ts";
import { SmtpAuthError, getSmtpDiagnostics } from "../_shared/smtp.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body = (await req.json()) as EmailPayload;

    if (!body?.type || !body?.data || typeof body.data !== "object") {
      return jsonResponse({ error: "Invalid payload: type and data are required" }, 400);
    }

    const result = await dispatchEmail(body);
    return jsonResponse({ ok: true, ...result });
  } catch (error) {
    console.error("send-email error:", error);

    if (error instanceof SmtpAuthError) {
      return jsonResponse(
        {
          error: error.message,
          code: "SMTP_AUTH_FAILED",
          diagnostics: getSmtpDiagnostics(),
          hints: error.hints,
        },
        500,
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("Missing or invalid") || message.includes("Invalid")
      ? 400
      : message.includes("SMTP not configured")
      ? 503
      : 500;
    return jsonResponse({ error: message, diagnostics: getSmtpDiagnostics() }, status);
  }
});
