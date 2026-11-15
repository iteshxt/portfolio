import { Resend } from "resend";
import { z } from "zod";
import { limitMessage, visitorKey } from "@/lib/arcee/ratelimit";
import { messageHtml, messageSubject, messageText } from "@/lib/email/message-email";

/**
 * Leave-a-message endpoint (docs/spec.md §8.5): only called when the visitor
 * presses Send on Arcee's draft or posts the contact page's postcard. Emails
 * Itesh via Resend.
 */

const Body = z.object({
  name: z.string().trim().min(1).max(80),
  contact: z.string().trim().min(3).max(120),
  message: z.string().trim().min(1).max(1200),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(200).optional(),
  /** Where it was written: Arcee's draft card or the contact page's postcard. */
  via: z.enum(["arcee", "postcard"]).optional(),
});

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "invalid" }, { status: 400 });
  const { name, contact, message, website, via = "arcee" } = parsed.data;

  // Bots that fill the honeypot get a polite "sure" and nothing happens.
  if (website) return Response.json({ ok: true });

  const limit = await limitMessage(visitorKey(req.headers));
  if (!limit.ok) return Response.json({ error: "rate-limited", retryAfter: limit.retryAfter }, { status: 429 });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return Response.json({ error: "not-configured" }, { status: 503 });

  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || "Arcee <onboarding@resend.dev>",
    to,
    replyTo: EMAIL.test(contact) ? contact : undefined,
    subject: messageSubject({ name, via }),
    html: messageHtml({ name, contact, message, via }),
    text: messageText({ name, contact, message, via }),
  });

  if (error) return Response.json({ error: "send-failed" }, { status: 502 });
  return Response.json({ ok: true });
}
