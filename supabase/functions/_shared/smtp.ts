import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

export type MailMessage = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
};

function env(name: string): string | undefined {
  const v = Deno.env.get(name);
  return v?.trim() || undefined;
}

/** Gmail app passwords are often pasted with spaces — remove them. */
function normalizePassword(pass: string): string {
  return pass.replace(/\s+/g, "");
}

export function getSmtpDiagnostics(): Record<string, string | boolean> {
  const host = env("SMTP_HOST");
  const from = env("SMTP_FROM");
  const user = env("SMTP_USER") || from;
  const pass = env("SMTP_PASS");
  const port = Number(env("SMTP_PORT") || "587");

  return {
    smtp_host_set: Boolean(host),
    smtp_from_set: Boolean(from),
    smtp_user_set: Boolean(env("SMTP_USER")),
    smtp_user_uses_from_fallback: !env("SMTP_USER") && Boolean(from),
    smtp_pass_set: Boolean(pass),
    smtp_pass_length: pass ? normalizePassword(pass).length : 0,
    smtp_host: host ?? "(missing)",
    smtp_port: port,
    smtp_user: user ? maskEmail(user) : "(missing)",
    smtp_from: from ? maskEmail(from) : "(missing)",
    smtp_user_matches_from: Boolean(user && from && user.toLowerCase() === from.toLowerCase()),
    tls_mode: port === 465 ? "implicit_ssl" : "starttls_on_587",
  };
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const shown = local.length <= 2 ? "*" : `${local.slice(0, 2)}***`;
  return `${shown}@${domain}`;
}

function smtpConfig() {
  const host = env("SMTP_HOST");
  const from = env("SMTP_FROM");
  const user = env("SMTP_USER") || from;
  const passRaw = env("SMTP_PASS");

  if (!host || !user || !passRaw || !from) {
    throw new Error(
      "SMTP not configured. Set SMTP_HOST, SMTP_PASS, SMTP_FROM (and SMTP_USER if different from FROM) in Edge Function secrets.",
    );
  }

  const port = Number(env("SMTP_PORT") || "587");
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a valid number (587 or 465).");
  }

  return {
    host,
    port,
    user,
    pass: normalizePassword(passRaw),
    from,
    fromName: env("SMTP_FROM_NAME") || "Complete My Project",
    tls: port === 465,
  };
}

export class SmtpAuthError extends Error {
  constructor(
    message: string,
    readonly hints: string[],
  ) {
    super(message);
    this.name = "SmtpAuthError";
  }
}

function authHints(cfg: ReturnType<typeof smtpConfig>): string[] {
  const host = cfg.host.toLowerCase();
  const hints = [
    "SMTP_USER must be the full login email (often same as SMTP_FROM).",
    "SMTP_PASS must have no extra spaces at start/end (we strip spaces for Gmail app passwords).",
    "Re-save secrets in Edge Functions → Secrets after any change.",
  ];

  if (host.includes("gmail") || host.includes("google")) {
    hints.push(
      "Gmail: enable 2-Step Verification, then create an App Password at https://myaccount.google.com/apppasswords",
      "Gmail: use that 16-character app password as SMTP_PASS — NOT your normal Gmail password.",
      "Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, SMTP_USER and SMTP_FROM = your Gmail address.",
    );
  }

  if (host.includes("office365") || host.includes("outlook") || host.includes("live.com")) {
    hints.push(
      "Microsoft: SMTP_HOST=smtp.office365.com, SMTP_PORT=587, use your Microsoft account or app password.",
    );
  }

  if (host.includes("ionos")) {
    hints.push(
      "IONOS: SMTP_HOST=smtp.ionos.co.uk, SMTP_USER and SMTP_FROM = full mailbox email (e.g. noreply@yourdomain.co.uk).",
      "IONOS: SMTP_PASS = that mailbox password from IONOS → Email → your mailbox (not your IONOS control-panel login).",
      "IONOS: In the mailbox settings, ensure SMTP sending is enabled.",
      "IONOS: If port 465 fails, try SMTP_PORT=587 (STARTTLS).",
      "IONOS: The mailbox must exist — create noreply@ in IONOS if you use that address.",
    );
  }

  if (cfg.user.toLowerCase() !== cfg.from.toLowerCase()) {
    hints.push(
      `SMTP_USER (${maskEmail(cfg.user)}) and SMTP_FROM (${maskEmail(cfg.from)}) differ — many providers require them to match.`,
    );
  }

  return hints;
}

export async function testSmtpConnection(): Promise<{ ok: true; diagnostics: Record<string, string | boolean> }> {
  const diagnostics = getSmtpDiagnostics();
  const cfg = smtpConfig();

  console.log("SMTP test connect:", JSON.stringify(diagnostics));

  const client = new SMTPClient({
    connection: {
      hostname: cfg.host,
      port: cfg.port,
      tls: cfg.tls,
      auth: { username: cfg.user, password: cfg.pass },
    },
  });

  try {
    await client.send({
      from: `${cfg.fromName} <${cfg.from}>`,
      to: cfg.from,
      subject: "SMTP test — Complete My Project",
      content: "If you received this, SMTP credentials are working.",
      html: "<p>If you received this, SMTP credentials are working.</p>",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("535") || msg.toLowerCase().includes("authentication")) {
      throw new SmtpAuthError(`SMTP authentication failed: ${msg}`, authHints(cfg));
    }
    throw err;
  } finally {
    await client.close();
  }

  return { ok: true, diagnostics };
}

export async function sendMail(message: MailMessage): Promise<void> {
  const cfg = smtpConfig();
  const recipients = Array.isArray(message.to) ? message.to : [message.to];
  const uniqueTo = [...new Set(recipients.map((e) => e.trim().toLowerCase()).filter(Boolean))];

  if (uniqueTo.length === 0) {
    console.warn("sendMail: no recipients, skipping");
    return;
  }

  console.log(
    "sendMail:",
    JSON.stringify({
      host: cfg.host,
      port: cfg.port,
      tls: cfg.tls,
      user: maskEmail(cfg.user),
      from: maskEmail(cfg.from),
      toCount: uniqueTo.length,
    }),
  );

  const client = new SMTPClient({
    connection: {
      hostname: cfg.host,
      port: cfg.port,
      tls: cfg.tls,
      auth: { username: cfg.user, password: cfg.pass },
    },
  });

  const fromHeader = `${cfg.fromName} <${cfg.from}>`;

  try {
    for (const to of uniqueTo) {
      await client.send({
        from: fromHeader,
        to,
        subject: message.subject,
        content: message.text,
        html: message.html,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("535") || msg.toLowerCase().includes("authentication")) {
      throw new SmtpAuthError(`SMTP authentication failed: ${msg}`, authHints(cfg));
    }
    throw err;
  } finally {
    await client.close();
  }
}

export async function sendMailToMany(messages: MailMessage[]): Promise<void> {
  for (const msg of messages) {
    await sendMail(msg);
  }
}
