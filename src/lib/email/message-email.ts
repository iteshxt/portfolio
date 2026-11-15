/**
 * The email Itesh gets when a visitor sends a message (docs/spec.md §8.5): a
 * postcard in the site's look, built from tables and inline styles so it holds
 * up in Gmail, Outlook and Apple Mail, plus a plain-text twin. Everything the
 * visitor typed is escaped.
 */

export type MessageEmail = {
  name: string;
  contact: string;
  message: string;
  via: "arcee" | "postcard";
  sentAt?: Date;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const C = {
  paper: "#F5F5F4",
  card: "#FFFFFF",
  ink: "#0E0E10",
  muted: "#6B6873",
  line: "#E3E2E6",
  violet: "#7A2CFF",
  lime: "#CCFF33",
  lavender: "#CBB8FF",
  red: "#C23A1F",
};
const SANS = "'Mona Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const SERIF = "'Instrument Serif',Georgia,'Times New Roman',serif";
const MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function stamp(when: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).formatToParts(when);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")} ${get("month").toUpperCase()} ${get("year")} · ${get("hour")}:${get("minute")} IST`;
}

export function messageSubject({ name, via }: Pick<MessageEmail, "name" | "via">): string {
  return via === "postcard" ? `A postcard from ${name}` : `${name} left you a message with Arcee`;
}

export function messageText({ name, contact, message, via }: MessageEmail): string {
  return `${message}\n\n— ${name}\nReply to: ${contact}\n\nSent from iteshxt.me ${via === "postcard" ? "on a postcard (contact page)" : "through Arcee, the site's chatbot"}.`;
}

export function messageHtml({ name, contact, message, via, sentAt = new Date() }: MessageEmail): string {
  const n = escapeHtml(name);
  const c = escapeHtml(contact);
  const body = escapeHtml(message).replace(/\r?\n/g, "<br>");
  const replyable = EMAIL.test(contact.trim());
  const replyHref = replyable ? `mailto:${encodeURIComponent(contact.trim())}?subject=${encodeURIComponent("Re: your message on iteshxt.me")}` : "";
  const how = via === "postcard" ? "Written on the postcard on the Contact page" : "Left with Arcee, the site&#39;s chatbot";
  const kicker = via === "postcard" ? "A postcard for you" : "A message via Arcee";
  const preheader = escapeHtml(message.replace(/\s+/g, " ").slice(0, 110));

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(messageSubject({ name, via }))}</title>
</head>
<body style="margin:0;padding:0;background:${C.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.paper};">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper};">
<tr><td align="center" style="padding:36px 14px 44px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">
    <!-- Wordmark and tag -->
    <tr><td style="padding:0 6px 18px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="font-family:${SERIF};font-style:italic;font-size:30px;line-height:1;color:${C.ink};">itesh</td>
        <td align="right"><span style="display:inline-block;background:${C.violet};color:#ffffff;border:3px solid #ffffff;border-radius:999px;padding:6px 14px;font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:0.02em;">${kicker}</span></td>
      </tr></table>
    </td></tr>

    <!-- The postcard -->
    <tr><td style="background:${C.card};border:1px solid ${C.line};border-radius:22px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td valign="top" style="padding:26px 26px 0;">
            <div style="font-family:${MONO};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${C.muted};">From</div>
            <div style="font-family:${SANS};font-size:28px;line-height:1.1;font-weight:700;letter-spacing:-0.03em;color:${C.ink};padding-top:6px;">${n}</div>
            <div style="font-family:${MONO};font-size:13px;color:${C.muted};padding-top:6px;">${replyable ? `<a href="${replyHref}" style="color:${C.violet};text-decoration:underline;">${c}</a>` : c}</div>
          </td>
          <td valign="top" align="right" width="112" style="padding:22px 22px 0 0;">
            <!-- The stamp, and the postmark over it -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;"><tr>
              <td align="center" style="background:${C.violet};border:3px dashed #ffffff;outline:2px solid ${C.violet};padding:10px 12px;color:#ffffff;">
                <div style="font-family:${MONO};font-size:9px;letter-spacing:0.16em;">NO. 01</div>
                <div style="font-family:${SERIF};font-style:italic;font-size:26px;line-height:1;padding:3px 0;">itesh</div>
                <div style="font-family:${MONO};font-size:9px;letter-spacing:0.16em;">FIRST CLASS</div>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr><td colspan="2" style="padding:0 26px;">
          <div style="display:inline-block;margin-top:14px;border:2px solid ${C.red};border-radius:6px;padding:3px 8px;font-family:${MONO};font-size:11px;font-weight:700;letter-spacing:0.14em;color:${C.red};">SENT · ${stamp(sentAt)}</div>
        </td></tr>
        <tr><td colspan="2" style="padding:22px 26px 0;"><div style="border-top:2px dashed ${C.line};font-size:0;line-height:0;">&nbsp;</div></td></tr>
        <tr><td colspan="2" style="padding:20px 26px 6px;">
          <div style="font-family:${MONO};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${C.muted};">Message</div>
          <div style="font-family:${SANS};font-size:19px;line-height:1.55;color:${C.ink};padding-top:10px;">${body}</div>
        </td></tr>
        <tr><td colspan="2" style="padding:22px 26px 28px;">
          ${
            replyable
              ? `<a href="${replyHref}" style="display:inline-block;background:${C.ink};color:#ffffff;border-radius:999px;padding:13px 22px;font-family:${SANS};font-size:15px;font-weight:700;text-decoration:none;">Reply to ${n} &rarr;</a>`
              : `<span style="display:inline-block;background:${C.lime};color:#2B3600;border-radius:999px;padding:11px 18px;font-family:${SANS};font-size:14px;font-weight:700;">Reach them at: ${c}</span>`
          }
        </td></tr>
      </table>
    </td></tr>

    <!-- Footer -->
    <tr><td style="padding:18px 8px 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${C.muted};">
      ${how} on <a href="https://iteshxt.me" style="color:${C.muted};text-decoration:underline;">iteshxt.me</a>. Hitting reply writes back to ${n}.
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}
