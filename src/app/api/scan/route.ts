import { z } from "zod";
import { limitScan, visitorKey } from "@/lib/arcee/ratelimit";
import { SCAN_CODE, markScanned, wasScanned } from "@/lib/scan-store";

/**
 * The manifest barcode egg (docs/design.md §2.17). The phone that scanned the
 * barcode POSTs its code; the desktop showing that barcode polls with GET.
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
  return Response.json({ scanned: await wasScanned(code) }, { headers: { "Cache-Control": "no-store" } });
}
