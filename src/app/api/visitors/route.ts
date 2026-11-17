import { randomBytes } from "node:crypto";
import { revalidateTag } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { STICKER_MOODS } from "@/lib/arcee/stickers";
import { limitSign, limitSignAttempt, limitSignEmail, visitorKey } from "@/lib/arcee/ratelimit";
import { sendVisitorEmail } from "@/lib/email/visitor-email";
import { SCAN_CODE, markScanned, wasScanned } from "@/lib/scan-store";
import { hasStorage, signVisitor } from "@/lib/visitors/store";
import { LINE_MAX, NAME_MAX, type SignError, type SignResponse, VISITORS_TAG, type VisitorEntry } from "@/lib/visitors/types";
import { resolveVisitMoment, validateCard } from "@/lib/visitors/validate";

/**
 * Signing the visitors' passport (docs/design.md §2.18): someone who scanned the barcode on
 * the Work page's manifest within the hour fills the arrival card and gets a numbered,
 * dated and timed stamp. The owner is emailed after the response, with a one-click hide link.
 *
 * Order matters: rejected cards are counted as attempts only, so a typo or a filtered word
 * doesn't use up the visitor's one stamp of the day, and the stamp limit is taken right
 * before the stamp is written. The scan check is a UX gate (you signed because you were
 * here), not an abuse control: codes are made in the browser, so the IP limits do that job.
 */

const Body = z.object({
  code: z.string().regex(SCAN_CODE),
  name: z.string().max(200),
  line: z.string().max(400).optional(),
  cat: z.string().max(32),
  website: z.string().max(200).optional(),
  // The visitor's local "YYYY-MM-DD". Never fails the card: anything odd falls back to the server's date.
  date: z.string().max(10).optional().catch(undefined),
  // The visitor's local moment, ISO with offset. Same: anything odd falls back to `date` and no time.
  at: z.string().max(40).optional().catch(undefined),
});

function fail(error: SignError, message: string, status: number) {
  return Response.json({ ok: false, error, message } satisfies SignResponse, { status });
}

const UNAVAILABLE = "The passport office isn't open yet.";

export async function POST(req: Request) {
  // The media type exactly: "text/plain; charset=application/json" is a CORS-safelisted
  // simple request any page could fire from a visitor's browser without a preflight.
  const type = req.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (type !== "application/json") return fail("invalid", "Send the arrival card as JSON.", 415);
  if (req.headers.get("sec-fetch-site") === "cross-site") return fail("invalid", "Sign the passport from the site itself.", 403);

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("invalid", "That arrival card is missing something.", 400);
  const { code, name, line, cat, website, date, at } = parsed.data;

  // Bots that fill the honeypot get a convincing stamp, and nothing is kept.
  if (website) {
    const fake = {
      id: randomBytes(16).toString("base64url"),
      n: 100 + (randomBytes(2).readUInt16BE() % 900),
      name: name.trim().slice(0, NAME_MAX) || "Visitor",
      line: (line ?? "").trim().slice(0, LINE_MAX),
      cat: (STICKER_MOODS as readonly string[]).includes(cat) ? (cat as (typeof STICKER_MOODS)[number]) : "hype",
      ...resolveVisitMoment(at, date),
    };
    return Response.json({ ok: true, entry: fake } satisfies SignResponse, { status: 201 });
  }

  const visitor = visitorKey(req.headers);
  let entry: VisitorEntry;
  try {
    const attempt = await limitSignAttempt(visitor);
    if (!attempt.ok) return fail("rate-limited", "That's a lot of tries. Take a breather and come back in a few minutes.", 429);

    if (!(await wasScanned(code))) return fail("not-scanned", "Scan the code on the Work page first.", 409);

    const card = validateCard({ name, line, cat });
    if (!card.ok) return fail(card.error, card.message, 422);

    // In-memory stamps would vanish between serverless instances: don't take them in production.
    if (process.env.VERCEL === "1" && !hasStorage()) return fail("unavailable", UNAVAILABLE, 503);

    const limit = await limitSign(visitor, code);
    if (!limit.ok) return fail("rate-limited", "One stamp per visitor per day. Come back tomorrow.", 429);

    entry = await signVisitor({ ...card.value, ...resolveVisitMoment(at, date) });
  } catch {
    // Redis down or out of quota: answer in the SignResponse shape, not a bare 500.
    return fail("unavailable", UNAVAILABLE, 503);
  }

  // The stamp exists now: make it visible and tell the owner before anything else can fail.
  // Expire now (not stale-while-revalidate): the signer goes straight to /visitors to find their stamp.
  revalidateTag(VISITORS_TAG, { expire: 0 });
  after(async () => {
    const quota = await limitSignEmail().catch(() => ({ ok: false }));
    if (quota.ok) await sendVisitorEmail(entry);
  });
  // Best effort: the desktop manifest printing the name is a nicety, the stamp is what counts.
  await markScanned(code, entry.name, entry.id).catch(() => {});

  return Response.json({ ok: true, entry } satisfies SignResponse, { status: 201 });
}
