import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import rateLimit from "express-rate-limit";

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many enquiries from this IP. Please try again later." },
});

function buildGuestEmailHtml(name: string, data: Record<string, unknown>): string {
  return `
    <div style="font-family:Inter,sans-serif;background:#080709;padding:0;margin:0;">
      <div style="background:#080709;border-top:4px solid #C9A84C;padding:32px;text-align:center;">
        <p style="color:#C9A84C;font-size:18px;font-weight:600;letter-spacing:0.1em;margin:0;">ATERA STAYS</p>
      </div>
      <div style="background:#ffffff;padding:40px 32px;">
        <p style="font-size:16px;color:#141414;">Hi ${name},</p>
        <p style="font-size:16px;color:#141414;line-height:1.7;">
          Thank you for your enquiry. We are checking availability and will be in touch within a few hours.
        </p>
        <p style="font-size:16px;color:#141414;line-height:1.7;">No payment has been taken.</p>
        <p style="font-size:16px;color:#141414;margin-top:32px;">— Atera Stays</p>
      </div>
      <div style="background:#080709;padding:16px 32px;text-align:center;">
        <p style="color:#8C8880;font-size:12px;margin:0;">ATERA INDUSTRIES LTD — Registered in England &amp; Wales</p>
      </div>
    </div>
  `;
}

function buildLandlordEmailHtml(name: string): string {
  return `
    <div style="font-family:Inter,sans-serif;background:#080709;padding:0;margin:0;">
      <div style="background:#080709;border-top:4px solid #C9A84C;padding:32px;text-align:center;">
        <p style="color:#C9A84C;font-size:18px;font-weight:600;letter-spacing:0.1em;margin:0;">ATERA STAYS</p>
      </div>
      <div style="background:#ffffff;padding:40px 32px;">
        <p style="font-size:16px;color:#141414;">Hi ${name},</p>
        <p style="font-size:16px;color:#141414;line-height:1.7;">
          Thank you for reaching out. A member of our team will call you shortly to discuss your property and options.
        </p>
        <p style="font-size:16px;color:#141414;margin-top:32px;">— Atera Stays</p>
      </div>
      <div style="background:#080709;padding:16px 32px;text-align:center;">
        <p style="color:#8C8880;font-size:12px;margin:0;">ATERA INDUSTRIES LTD — Registered in England &amp; Wales</p>
      </div>
    </div>
  `;
}

function buildInternalEmailHtml(type: string, data: Record<string, unknown>): string {
  const rows = Object.entries(data)
    .filter(([k]) => k !== "type")
    .map(([k, v]) => `<tr><td style="padding:6px 12px;background:#f5f5f5;font-weight:600;font-size:13px;width:180px;">${k}</td><td style="padding:6px 12px;font-size:13px;">${v ?? "—"}</td></tr>`)
    .join("");
  return `
    <div style="font-family:Inter,sans-serif;">
      <div style="background:#C9A84C;padding:16px 24px;">
        <p style="color:#080709;font-weight:700;font-size:16px;margin:0;">NEW ${type.toUpperCase()} ENQUIRY — ${data.name}</p>
        <p style="color:#080709;font-size:12px;margin:4px 0 0;">${new Date().toISOString()}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
    </div>
  `;
}

router.post("/enquiry", limiter, async (req, res) => {
  try {
    const body = req.body as Record<string, unknown>;
    const { name, email, type } = body;

    if (!name || !email || !type) {
      return res.status(400).json({ error: "Name, email, and type are required." });
    }

    if (!["guest", "landlord"].includes(type as string)) {
      return res.status(400).json({ error: "Invalid enquiry type." });
    }

    const { error: dbError } = await supabase.from("enquiries").insert([body]);
    if (dbError) {
      req.log.error({ dbError }, "Supabase insert failed");
      return res.status(500).json({ error: "Failed to save enquiry. Please try again." });
    }

    const internalEmail = process.env.INTERNAL_EMAIL;
    const fromEmail = "noreply@notifications.aterastays.com";

    const sendPromises = [];

    if (type === "guest") {
      sendPromises.push(
        resend.emails.send({
          from: `Atera Stays <${fromEmail}>`,
          to: email as string,
          subject: "Enquiry received — Atera Stays",
          html: buildGuestEmailHtml(name as string, body),
        })
      );
    } else {
      sendPromises.push(
        resend.emails.send({
          from: `Atera Stays <${fromEmail}>`,
          to: email as string,
          subject: "Thank you for your enquiry — Atera Stays",
          html: buildLandlordEmailHtml(name as string),
        })
      );
    }

    if (internalEmail) {
      sendPromises.push(
        resend.emails.send({
          from: `Atera Stays <${fromEmail}>`,
          to: internalEmail,
          subject: `NEW ${(type as string).toUpperCase()} ENQUIRY — ${name}`,
          html: buildInternalEmailHtml(type as string, body),
        })
      );
    }

    await Promise.allSettled(sendPromises);

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Enquiry handler error");
    res.status(500).json({ error: "Connection issue. Please try again." });
  }
});

export default router;
