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

function escapeHtml(value: unknown): string {
  return String(value ?? "—")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildGuestEmailHtml(name: string): string {
  const safeName = escapeHtml(name);
  return `
    <div style="font-family:Inter,sans-serif;background:#080709;padding:0;margin:0;">
      <div style="background:#080709;border-top:4px solid #C9A84C;padding:32px;text-align:center;">
        <p style="color:#C9A84C;font-size:18px;font-weight:600;letter-spacing:0.1em;margin:0;">ATERA STAYS</p>
      </div>
      <div style="background:#ffffff;padding:40px 32px;">
        <p style="font-size:16px;color:#141414;">Hi ${safeName},</p>
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
  const safeName = escapeHtml(name);
  return `
    <div style="font-family:Inter,sans-serif;background:#080709;padding:0;margin:0;">
      <div style="background:#080709;border-top:4px solid #C9A84C;padding:32px;text-align:center;">
        <p style="color:#C9A84C;font-size:18px;font-weight:600;letter-spacing:0.1em;margin:0;">ATERA STAYS</p>
      </div>
      <div style="background:#ffffff;padding:40px 32px;">
        <p style="font-size:16px;color:#141414;">Hi ${safeName},</p>
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
    .map(([k, v]) => `<tr><td style="padding:6px 12px;background:#f5f5f5;font-weight:600;font-size:13px;width:180px;">${escapeHtml(k)}</td><td style="padding:6px 12px;font-size:13px;">${escapeHtml(v)}</td></tr>`)
    .join("");
  const safeType = escapeHtml(type).toUpperCase();
  const safeName = escapeHtml(data.name);
  return `
    <div style="font-family:Inter,sans-serif;">
      <div style="background:#C9A84C;padding:16px 24px;">
        <p style="color:#080709;font-weight:700;font-size:16px;margin:0;">NEW ${safeType} ENQUIRY — ${safeName}</p>
        <p style="color:#080709;font-size:12px;margin:4px 0 0;">${escapeHtml(new Date().toISOString())}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
    </div>
  `;
}

const SERVICE_TYPE_VALUES = ["stays", "management"] as const;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function optStr(value: unknown, maxLen: number): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") return undefined;
  return value.slice(0, maxLen);
}

function optInt(value: unknown, min: number, max: number): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) return undefined;
  return n;
}

function optFloat(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  if (!isFinite(n) || n < 0) return undefined;
  return n;
}

function optBool(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function optDate(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string" || !DATE_RE.test(value)) return undefined;
  const d = new Date(value);
  if (isNaN(d.getTime())) return undefined;
  return value;
}

type GuestEnquiry = {
  type: "guest";
  name: string;
  email: string;
  phone?: string;
  property_id?: string;
  property_name?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  type_of_stay?: string;
  message?: string;
};

type LandlordEnquiry = {
  type: "landlord";
  name: string;
  email: string;
  phone?: string;
  address?: string;
  service_type?: "stays" | "management";
  bedrooms?: number;
  current_rent?: number;
  tenanted?: boolean;
  available_from?: string;
  current_situation?: string;
  goals?: string;
  message?: string;
};

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function validateGuestBody(raw: Record<string, unknown>): ValidationResult<GuestEnquiry> {
  const name = optStr(raw.name, 200);
  const email = optStr(raw.email, 320);

  if (!name) return { ok: false, error: "Name is required." };
  if (!email || !EMAIL_RE.test(email)) return { ok: false, error: "A valid email address is required." };

  const data: GuestEnquiry = {
    type: "guest",
    name,
    email,
    phone: optStr(raw.phone, 30),
    property_id: optStr(raw.property_id, 36),
    property_name: optStr(raw.property_name, 200),
    check_in: optDate(raw.check_in),
    check_out: optDate(raw.check_out),
    guests: optInt(raw.guests, 1, 50),
    type_of_stay: optStr(raw.type_of_stay, 100),
    message: optStr(raw.message, 2000),
  };

  return { ok: true, data };
}

function validateLandlordBody(raw: Record<string, unknown>): ValidationResult<LandlordEnquiry> {
  const name = optStr(raw.name, 200);
  const email = optStr(raw.email, 320);

  if (!name) return { ok: false, error: "Name is required." };
  if (!email || !EMAIL_RE.test(email)) return { ok: false, error: "A valid email address is required." };

  const rawServiceType = optStr(raw.service_type, 20);
  if (rawServiceType !== undefined && !(SERVICE_TYPE_VALUES as readonly string[]).includes(rawServiceType)) {
    return { ok: false, error: "Invalid service type. Must be 'stays' or 'management'." };
  }
  const service_type = rawServiceType as "stays" | "management" | undefined;

  const data: LandlordEnquiry = {
    type: "landlord",
    name,
    email,
    phone: optStr(raw.phone, 30),
    address: optStr(raw.address, 500),
    service_type,
    bedrooms: optInt(raw.bedrooms, 1, 50),
    current_rent: optFloat(raw.current_rent),
    tenanted: optBool(raw.tenanted),
    available_from: optDate(raw.available_from),
    current_situation: optStr(raw.current_situation, 2000),
    goals: optStr(raw.goals, 2000),
    message: optStr(raw.message, 2000),
  };

  return { ok: true, data };
}

router.post("/enquiry", limiter, async (req, res) => {
  try {
    const raw = req.body as Record<string, unknown>;
    const type = optStr(raw.type, 20);

    if (!type || !["guest", "landlord"].includes(type)) {
      res.status(400).json({ error: "Invalid enquiry type." });
      return;
    }

    const validation =
      type === "guest"
        ? validateGuestBody(raw)
        : validateLandlordBody(raw);

    if (!validation.ok) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const safeData = validation.data;

    const insertData = Object.fromEntries(
      Object.entries(safeData).filter(([, v]) => v !== undefined && v !== null)
    );

    const { error: dbError } = await supabase.from("enquiries").insert([insertData]);
    if (dbError) {
      req.log.error({ dbError }, "Supabase insert failed");
      res.status(500).json({ error: "Failed to save enquiry. Please try again." });
      return;
    }

    const internalEmail = process.env.INTERNAL_EMAIL;
    const fromEmail = "noreply@notifications.aterastays.com";

    const sendPromises = [];

    if (type === "guest") {
      sendPromises.push(
        resend.emails.send({
          from: `Atera Stays <${fromEmail}>`,
          to: safeData.email,
          subject: "Enquiry received — Atera Stays",
          html: buildGuestEmailHtml(safeData.name),
        })
      );
    } else {
      sendPromises.push(
        resend.emails.send({
          from: `Atera Stays <${fromEmail}>`,
          to: safeData.email,
          subject: "Thank you for your enquiry — Atera Stays",
          html: buildLandlordEmailHtml(safeData.name),
        })
      );
    }

    if (internalEmail) {
      sendPromises.push(
        resend.emails.send({
          from: `Atera Stays <${fromEmail}>`,
          to: internalEmail,
          subject: `NEW ${type.toUpperCase()} ENQUIRY — ${safeData.name}`,
          html: buildInternalEmailHtml(type, safeData as unknown as Record<string, unknown>),
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
