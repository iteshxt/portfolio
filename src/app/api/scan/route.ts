import { z } from "zod";
import { limitScan, limitScanPoll, visitorKey } from "@/lib/arcee/ratelimit";
import { SCAN_CODE, markScanned, scanInfo } from "@/lib/scan-store";

/**
 * The manifest barcode egg (docs/design.md §2.17). The phone that scanned the
 * barcode POSTs its code; the desktop showing that barcode polls with GET, which also
 * returns the visitor's name once they've signed the passport (docs/design.md §2.18).
 * Codes are made in the browser, so a scan is a UX signal, not proof of presence: the
 * passport's IP limits are the abuse control. GET is limited so codes can't be enumerated.
 */

const Body = z.object({ code: z.string().regex(SCAN_CODE) });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "invalid" }, { status: 400 });
  const limit = await limitScan(visitorKey(req.headers));
  if (!limit.ok) return Response.json({ error: "rate-limited" }, { status: 429 });
  await markScanned(parsed.data.code);
  return Response.json({ ok: true });
}

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code") ?? "";
  if (!SCAN_CODE.test(code)) return Response.json({ error: "invalid" }, { status: 400 });
  const noStore = { "Cache-Control": "no-store" };
  const limit = await limitScanPoll(visitorKey(req.headers));
  if (!limit.ok) return Response.json({ error: "rate-limited" }, { status: 429, headers: noStore });
  return Response.json(await scanInfo(code), { headers: noStore });
}
