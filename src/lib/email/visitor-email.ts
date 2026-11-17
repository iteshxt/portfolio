import { Resend } from "resend";
import { STICKERS } from "@/lib/arcee/stickers";
import { hideToken } from "@/lib/visitors/hide-token";
import { type VisitorEntry, visitorNo } from "@/lib/visitors/types";
import { escapeHtml } from "./message-email";

/**
 * The email Itesh gets for each new stamp in the visitors' passport (docs/design.md §2.18),
 * with a one-click hide link: moderation without an admin panel. The link opens a confirm
 * page (mail scanners pre-fetch links, so a GET never hides anything). Built like
 * message-email: tables and inline styles, a plain-text twin, everything escaped.
 */

const C = { paper: "#F5F5F4", card: "#FFFFFF", ink: "#0E0E10", muted: "#6B6873", line: "#E3E2E6", violet: "#7A2CFF", red: "#C23A1F" };
const SANS = "'Mona Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const SERIF = "'Instrument Serif',Georgia,'Times New Roman',serif";
const MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";

const site = () => (process.env.NEXT_PUBLIC_SITE_URL ?? "https://iteshxt.me").replace(/\/+$/, "");

/** The confirm page for hiding this stamp, or null when no signing key is configured. */
export function hideLink(entry: Pick<VisitorEntry, "id">): string | null {
  const t = hideToken(entry.id);
  return t ? `${site()}/visitors/hide?id=${encodeURIComponent(entry.id)}&t=${encodeURIComponent(t)}` : null;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-11-17" as "17 Nov 2026" (the day the visitor signed), or null when it isn't a "YYYY-MM-DD". */
export function formatVisitDate(d: string | undefined): string | null {
  const m = d?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const month = m ? MONTHS[Number(m[2]) - 1] : undefined;
  const day = m ? Number(m[3]) : 0;
  return m && month && day >= 1 && day <= 31 ? `${day} ${month} ${m[1]}` : null;
}

/**
 * The date and, when the stamp has one, the visitor's wall-clock time: "17 Nov 2026, 22:14".
 * Just the date for older stamps (or a malformed time), null without a date.
 */
export function formatVisitMoment(entry: Pick<VisitorEntry, "d" | "tm">): string | null {
  const date = formatVisitDate(entry.d);
  if (!date) return null;
  return entry.tm && /^([01]\d|2[0-3]):[0-5]\d$/.test(entry.tm) ? `${date}, ${entry.tm}` : date;
}

export function visitorSubject(entry: Pick<VisitorEntry, "name" | "n">): string {
  return `New stamp in the passport: ${entry.name} (No. ${visitorNo(entry.n)})`;
}

export function visitorText(entry: VisitorEntry): string {
  const hide = hideLink(entry);
  const date = formatVisitMoment(entry);
  return [
    `Visitor No. ${visitorNo(entry.n)}: ${entry.name}`,
    ...(date ? [`Signed on: ${date}`] : []),
    `Reason for visit: ${entry.line || "(left blank)"}`,
    `Passport photo: the ${entry.cat} cat`,
    "",
    hide ? `Not OK? Hide it from the passport: ${hide}` : "Hide links need VISITOR_HIDE_SECRET (or RESEND_API_KEY) on the server.",
    "",
    `See every stamp: ${site()}/visitors`,
  ].join("\n");
}

export function visitorHtml(entry: VisitorEntry): string {
  const name = escapeHtml(entry.name);
  const line = entry.line ? escapeHtml(entry.line) : `<span style="color:${C.muted};font-style:italic;">left blank</span>`;
  const no = visitorNo(entry.n);
  const date = formatVisitMoment(entry);
  const hide = hideLink(entry);
  const photo = `${site()}${STICKERS[entry.cat].still}`;
  const passport = `${site()}/visitors`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(visitorSubject(entry))}</title>
</head>
<body style="margin:0;padding:0;background:${C.paper};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper};">
<tr><td align="center" style="padding:36px 14px 44px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">
    <tr><td style="padding:0 6px 18px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="font-family:${SERIF};font-style:italic;font-size:30px;line-height:1;color:${C.ink};">itesh</td>
        <td align="right"><span style="display:inline-block;background:${C.violet};color:#ffffff;border:3px solid #ffffff;border-radius:999px;padding:6px 14px;font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:0.02em;">New stamp</span></td>
      </tr></table>
    </td></tr>

    <tr><td style="background:${C.card};border:1px solid ${C.line};border-radius:22px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td valign="top" width="104" style="padding:26px 0 0 26px;">
            <img src="${escapeHtml(photo)}" width="84" height="84" alt="The ${escapeHtml(entry.cat)} cat" style="display:block;width:84px;height:84px;border-radius:14px;border:3px solid ${C.line};object-fit:cover;">
          </td>
          <td valign="top" style="padding:26px 26px 0 16px;">
            <div style="font-family:${MONO};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${C.muted};">Visitor No. ${no}</div>
            <div style="font-family:${SANS};font-size:28px;line-height:1.1;font-weight:700;letter-spacing:-0.03em;color:${C.ink};padding-top:6px;">${name}</div>
            <div style="display:inline-block;margin-top:10px;border:2px solid ${C.red};border-radius:6px;padding:3px 8px;font-family:${MONO};font-size:11px;font-weight:700;letter-spacing:0.14em;color:${C.red};">ADMITTED${date ? ` &middot; ${escapeHtml(date)}` : ""}</div>
          </td>
        </tr>
        <tr><td colspan="2" style="padding:22px 26px 0;"><div style="border-top:2px dashed ${C.line};font-size:0;line-height:0;">&nbsp;</div></td></tr>
        <tr><td colspan="2" style="padding:20px 26px 6px;">
          <div style="font-family:${MONO};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${C.muted};">Reason for visit</div>
          <div style="font-family:${SANS};font-size:19px;line-height:1.55;color:${C.ink};padding-top:10px;">${line}</div>
        </td></tr>
        <tr><td colspan="2" style="padding:22px 26px 28px;">
          ${
            hide
              ? `<a href="${escapeHtml(hide)}" style="display:inline-block;background:${C.ink};color:#ffffff;border-radius:999px;padding:13px 22px;font-family:${SANS};font-size:15px;font-weight:700;text-decoration:none;">Hide this stamp &rarr;</a>`
              : `<span style="font-family:${SANS};font-size:14px;color:${C.muted};">Hide links need VISITOR_HIDE_SECRET on the server.</span>`
          }
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:18px 8px 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${C.muted};">
      Signed into the passport on <a href="${escapeHtml(passport)}" style="color:${C.muted};text-decoration:underline;">${escapeHtml(passport.replace(/^https?:\/\//, ""))}</a>. The hide button asks before it does anything.
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

/**
 * Sends the new-stamp email. Called from after(), once the visitor already has their
 * stamp: skips quietly when Resend isn't configured and never throws.
 */
export async function sendVisitorEmail(entry: VisitorEntry): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return false;
  try {
    const { error } = await new Resend(key).emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "Arcee <onboarding@resend.dev>",
      to,
      subject: visitorSubject(entry),
      html: visitorHtml(entry),
      text: visitorText(entry),
    });
    return !error;
  } catch {
    return false;
  }
}
