import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The route runs outside Next here: stand in for the cache and after(), and never send email.
const revalidateTag = vi.fn();
const later: (() => unknown)[] = [];
const sendVisitorEmail = vi.fn(async () => true);
/** Flip to make the store's write fail like a Redis outage. */
const outage = { sign: false };
vi.mock("next/cache", () => ({ revalidateTag }));
vi.mock("./store", async (importOriginal) => {
  const real = await importOriginal<typeof import("./store")>();
  return {
    ...real,
    signVisitor: async (card: Parameters<typeof real.signVisitor>[0]) => {
      if (outage.sign) throw new Error("redis down");
      return real.signVisitor(card);
    },
  };
});
vi.mock("next/server", () => ({ after: (fn: () => unknown) => later.push(fn) }));
vi.mock("@/lib/email/visitor-email", () => ({ sendVisitorEmail }));
vi.mock("resend", () => ({
  Resend: class {
    constructor() {
      throw new Error("tests must not send email");
    }
  },
}));

const { POST } = await import("@/app/api/visitors/route");
const { POST: HIDE } = await import("@/app/api/visitors/hide/route");
const { GET: SCAN_GET } = await import("@/app/api/scan/route");
const { markScanned, scanInfo } = await import("@/lib/scan-store");
const { hideVisitor, listVisitors } = await import("./store");
const { hideToken } = await import("./hide-token");
const { utcDate } = await import("./validate");
const { limitSignEmail } = await import("@/lib/arcee/ratelimit");

/** A moment as a visitor's browser would send it: their wall clock, then their offset ("+05:30"). */
function localIso(t: Date, offsetMin: number): string {
  const wall = new Date(t.getTime() + offsetMin * 60_000).toISOString().slice(0, 19);
  const abs = Math.abs(offsetMin);
  return `${wall}${offsetMin < 0 ? "-" : "+"}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}

let ipCounter = 0;
const freshIp = () => `10.0.${Math.floor(++ipCounter / 250)}.${ipCounter % 250}`;

function sign(body: Record<string, unknown>, ip = freshIp(), type = "application/json", extra: Record<string, string> = {}) {
  return POST(
    new Request("http://localhost/api/visitors", {
      method: "POST",
      headers: { "content-type": type, "x-forwarded-for": ip, ...extra },
      body: JSON.stringify(body),
    }),
  );
}

describe("POST /api/visitors", () => {
  beforeEach(() => {
    revalidateTag.mockClear();
    sendVisitorEmail.mockClear();
    later.length = 0;
    delete process.env.VERCEL;
  });

  it("answers in the SignResponse shape when the card itself is malformed", async () => {
    const res = await sign({ code: "abcd", name: 42, cat: "hype" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "invalid", message: "That arrival card is missing something." });
  });

  it("only takes JSON", async () => {
    const res = await sign({ code: "abcd", name: "Ada", cat: "hype" }, freshIp(), "text/plain");
    expect(res.status).toBe(415);
    // A CORS-safelisted type dressed up as JSON doesn't count.
    const dodge = await sign({ code: "abcd", name: "Ada", cat: "hype" }, freshIp(), "text/plain; charset=application/json");
    expect(dodge.status).toBe(415);
    await markScanned("ctj1");
    expect((await sign({ code: "ctj1", name: "Ada", cat: "hype" }, freshIp(), "Application/JSON; charset=utf-8")).status).toBe(201);
  });

  it("refuses cross-site posts", async () => {
    await markScanned("xs01");
    const res = await sign({ code: "xs01", name: "Ada", cat: "hype" }, freshIp(), "application/json", { "sec-fetch-site": "cross-site" });
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ ok: false, error: "invalid" });
  });

  it("gives honeypot bots a fake stamp and keeps nothing", async () => {
    const before = (await listVisitors()).total;
    const res = await sign({ code: "zzzz", name: "Bot", cat: "hype", website: "http://spam" });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject({ ok: true, entry: { name: "Bot", cat: "hype" } });
    // As convincing as a real one: numbered and dated.
    expect(Object.keys(body.entry).sort()).toEqual(["cat", "d", "id", "line", "n", "name"]);
    expect((await listVisitors()).total).toBe(before);
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(later).toHaveLength(0);
  });

  it("needs a scanned code", async () => {
    const res = await sign({ code: "nscan1", name: "Ada", cat: "hype" });
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ ok: false, error: "not-scanned", message: "Scan the code on the Work page first." });
  });

  it("rejects unfriendly words without using up the day's stamp", async () => {
    await markScanned("rej1");
    const ip = freshIp();
    const res = await sign({ code: "rej1", name: "chutiya", cat: "hype" }, ip);
    expect(res.status).toBe(422);
    expect(await res.json()).toMatchObject({ ok: false, error: "rejected" });
    const retry = await sign({ code: "rej1", name: "Ada", cat: "hype" }, ip);
    expect(retry.status).toBe(201);
  });

  it("refuses a cat that isn't one of Arcee's", async () => {
    await markScanned("cat1");
    const res = await sign({ code: "cat1", name: "Ada", cat: "dog" });
    expect(res.status).toBe(422);
    expect(await res.json()).toMatchObject({ ok: false, error: "invalid" });
  });

  it("stamps the passport, names the scan, revalidates and emails after the response", async () => {
    await markScanned("ok01");
    const before = utcDate(new Date());
    const res = await sign({ code: "ok01", name: "  Ada  ", line: "Saw the barcode", cat: "sus" });
    const after = utcDate(new Date());
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.entry).toMatchObject({ name: "Ada", line: "Saw the barcode", cat: "sus" });
    expect(typeof body.entry.n).toBe("number");
    expect([before, after]).toContain(body.entry.d);
    expect(Object.keys(body.entry).sort()).toEqual(["cat", "d", "id", "line", "n", "name"]);
    expect((await listVisitors()).entries[0]).toEqual(body.entry);
    expect(await scanInfo("ok01")).toEqual({ scanned: true, name: "Ada" });
    expect(revalidateTag).toHaveBeenCalledWith("visitors", { expire: 0 });
    expect(sendVisitorEmail).not.toHaveBeenCalled();
    await Promise.all(later.map((fn) => fn()));
    expect(sendVisitorEmail).toHaveBeenCalledWith(body.entry);
  });

  it("dates the stamp with the visitor's own day when it's within a day of the server's", async () => {
    // Tomorrow in UTC is today somewhere east (UTC+14 is a day ahead for ten hours of every UTC day).
    const tomorrow = utcDate(new Date(Date.now() + 86_400_000));
    await markScanned("dt01");
    const res = await sign({ code: "dt01", name: "Kiri", cat: "hype", date: tomorrow });
    expect(res.status).toBe(201);
    const { entry } = await res.json();
    expect(entry.d).toBe(tomorrow);
    expect((await listVisitors()).entries[0]).toEqual(entry);
    await Promise.all(later.map((fn) => fn()));
    expect(sendVisitorEmail).toHaveBeenCalledWith(entry);
  });

  it("falls back to the server's UTC date for a missing, odd or far-off date, without failing the card", async () => {
    const odd: unknown[] = [undefined, "not-a-date", "2026-02-30", "1999-01-01", "2026-11-17T10:00:00Z", 20261117, { y: 2026 }];
    for (const [i, date] of odd.entries()) {
      const code = `df0${i}`;
      await markScanned(code);
      const before = utcDate(new Date());
      const res = await sign({ code, name: "Ada", cat: "hype", date });
      const after = utcDate(new Date());
      expect(res.status, JSON.stringify(date)).toBe(201);
      const { entry } = await res.json();
      expect([before, after], JSON.stringify(date)).toContain(entry.d);
    }
  });

  it("stamps the visitor's own date and wall-clock time from their local moment", async () => {
    const at = localIso(new Date(), 330);
    await markScanned("tm01");
    const res = await sign({ code: "tm01", name: "Asha", cat: "hype", at, date: "1999-01-01" });
    expect(res.status).toBe(201);
    const { entry } = await res.json();
    expect(entry.d).toBe(at.slice(0, 10));
    expect(entry.tm).toBe(at.slice(11, 16));
    expect(Object.keys(entry).sort()).toEqual(["cat", "d", "id", "line", "n", "name", "tm"]);
    expect((await listVisitors()).entries[0]).toEqual(entry);
    await Promise.all(later.map((fn) => fn()));
    expect(sendVisitorEmail).toHaveBeenCalledWith(entry);
  });

  it("falls back to the date field and no time for an odd or skewed moment, without failing the card", async () => {
    const hourOff = localIso(new Date(Date.now() + 3_600_000), 0);
    const odd: unknown[] = [hourOff, "2026-11-17T24:00:00Z", "now", `${localIso(new Date(), 0)}${" ".repeat(40)}`, 1_763_397_845_000, { at: 1 }, null];
    for (const [i, at] of odd.entries()) {
      const code = `tf0${i}`;
      await markScanned(code);
      const before = utcDate(new Date());
      const res = await sign({ code, name: "Ada", cat: "hype", at });
      const after = utcDate(new Date());
      expect(res.status, JSON.stringify(at)).toBe(201);
      const { entry } = await res.json();
      expect([before, after], JSON.stringify(at)).toContain(entry.d);
      expect("tm" in entry, JSON.stringify(at)).toBe(false);
    }
  });

  it("times the honeypot's fake stamp too", async () => {
    const at = localIso(new Date(), -300);
    const res = await sign({ code: "zzzz", name: "Bot", cat: "hype", website: "http://spam", at });
    const { entry } = await res.json();
    expect(entry).toMatchObject({ d: at.slice(0, 10), tm: at.slice(11, 16) });
  });

  it("allows one stamp per visitor per day", async () => {
    await markScanned("rl01");
    const ip = freshIp();
    expect((await sign({ code: "rl01", name: "Ada", cat: "hype" }, ip)).status).toBe(201);
    const second = await sign({ code: "rl01", name: "Ada again", cat: "hype" }, ip);
    expect(second.status).toBe(429);
    expect(await second.json()).toEqual({ ok: false, error: "rate-limited", message: "One stamp per visitor per day. Come back tomorrow." });
  });

  it("lets a few people behind one address sign, each once", async () => {
    const ip = freshIp();
    for (const code of ["ip01", "ip02", "ip03", "ip04"]) await markScanned(code);
    for (const code of ["ip01", "ip02", "ip03"]) expect((await sign({ code, name: "Ada", cat: "hype" }, ip)).status).toBe(201);
    expect((await sign({ code: "ip04", name: "Ada", cat: "hype" }, ip)).status).toBe(429);
  });

  it("answers a store outage in the SignResponse shape", async () => {
    await markScanned("out1");
    outage.sign = true;
    const res = await sign({ code: "out1", name: "Ada", cat: "hype" });
    outage.sign = false;
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: "unavailable", message: "The passport office isn't open yet." });
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("stops emailing the owner past the daily email cap, but still stamps", async () => {
    while ((await limitSignEmail()).ok);
    await markScanned("em01");
    const res = await sign({ code: "em01", name: "Ada", cat: "hype" });
    expect(res.status).toBe(201);
    await Promise.all(later.map((fn) => fn()));
    expect(sendVisitorEmail).not.toHaveBeenCalled();
  });

  it("stays closed on Vercel without durable storage", async () => {
    process.env.VERCEL = "1";
    await markScanned("vc01");
    const res = await sign({ code: "vc01", name: "Ada", cat: "hype" });
    delete process.env.VERCEL;
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ ok: false, error: "unavailable" });
  });
});

describe("GET /api/scan", () => {
  const poll = (code: string) => SCAN_GET(new Request(`http://localhost/api/scan?code=${code}`, { headers: { "x-forwarded-for": freshIp() } }));

  it("reports an unscanned code, uncached", async () => {
    const res = await poll("never1");
    expect(await res.json()).toEqual({ scanned: false });
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  it("prints the signer's name, keeps it on a re-scan, and drops it once the stamp is hidden", async () => {
    await markScanned("gs01");
    expect(await (await poll("gs01")).json()).toEqual({ scanned: true });
    const { entry } = await (await sign({ code: "gs01", name: "Ada", cat: "hype" })).json();
    expect(await (await poll("gs01")).json()).toEqual({ scanned: true, name: "Ada" });
    await markScanned("gs01");
    expect(await scanInfo("gs01")).toEqual({ scanned: true, name: "Ada" });
    await hideVisitor(entry.id);
    expect(await (await poll("gs01")).json()).toEqual({ scanned: true });
  });
});

describe("POST /api/visitors/hide", () => {
  const secret = process.env.VISITOR_HIDE_SECRET;
  beforeEach(() => {
    delete process.env.VERCEL;
    process.env.VISITOR_HIDE_SECRET = "test-secret";
  });
  afterEach(() => {
    if (secret === undefined) delete process.env.VISITOR_HIDE_SECRET;
    else process.env.VISITOR_HIDE_SECRET = secret;
  });

  function hide(fields: Record<string, string>) {
    return HIDE(new Request("http://localhost/api/visitors/hide", { method: "POST", body: new URLSearchParams(fields) }));
  }

  it("hides with a valid token and redirects to the done page", async () => {
    await markScanned("hd01");
    const { entry } = await (await sign({ code: "hd01", name: "Hidey", cat: "hype" })).json();
    revalidateTag.mockClear();
    const res = await hide({ id: entry.id, t: hideToken(entry.id) as string });
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("http://localhost/visitors/hide?done=1");
    expect((await listVisitors()).entries.find((e) => e.id === entry.id)).toBeUndefined();
    expect(revalidateTag).toHaveBeenCalledWith("visitors", { expire: 0 });
  });

  it("refuses a bad token", async () => {
    await markScanned("hd02");
    const { entry } = await (await sign({ code: "hd02", name: "Stays", cat: "hype" })).json();
    const res = await hide({ id: entry.id, t: "x".repeat(43) });
    expect(res.headers.get("location")).toBe("http://localhost/visitors/hide?invalid=1");
    expect((await listVisitors()).entries.find((e) => e.id === entry.id)).toBeDefined();
  });
});
