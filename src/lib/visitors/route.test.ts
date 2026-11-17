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
const { limitSignEmail } = await import("@/lib/arcee/ratelimit");

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
    const res = await sign({ code: "ok01", name: "  Ada  ", line: "Saw the QR", cat: "sus" });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.entry).toMatchObject({ name: "Ada", line: "Saw the QR", cat: "sus" });
    expect(typeof body.entry.n).toBe("number");
    expect(Object.keys(body.entry).sort()).toEqual(["cat", "id", "line", "n", "name"]);
    expect((await listVisitors()).entries[0]).toEqual(body.entry);
    expect(await scanInfo("ok01")).toEqual({ scanned: true, name: "Ada" });
    expect(revalidateTag).toHaveBeenCalledWith("visitors", { expire: 0 });
    expect(sendVisitorEmail).not.toHaveBeenCalled();
    await Promise.all(later.map((fn) => fn()));
    expect(sendVisitorEmail).toHaveBeenCalledWith(body.entry);
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
