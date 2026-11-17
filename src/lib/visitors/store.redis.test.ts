import { describe, expect, it, vi } from "vitest";

/**
 * The Redis paths of the passport store and the scan store, against a small in-process
 * stand-in for @upstash/redis. Like the real client, it hands JSON values back parsed
 * (automatic deserialisation), which parse() and the scan reader must cope with.
 */

const data = new Map<string, unknown>();
const revive = (v: unknown) => {
  if (typeof v !== "string") return v;
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
};
const hash = (key: string) => {
  if (!data.has(key)) data.set(key, new Map<string, string>());
  return data.get(key) as Map<string, string>;
};
const zset = (key: string) => {
  if (!data.has(key)) data.set(key, new Map<string, number>());
  return data.get(key) as Map<string, number>;
};

class FakeRedis {
  async incr(key: string) {
    const n = Number(data.get(key) ?? 0) + 1;
    data.set(key, n);
    return n;
  }
  hset(key: string, fields: Record<string, string>) {
    for (const [f, v] of Object.entries(fields)) hash(key).set(f, v);
    return Promise.resolve(Object.keys(fields).length);
  }
  async hget(key: string, field: string) {
    const v = hash(key).get(field);
    return v === undefined ? null : revive(v);
  }
  async hmget(key: string, ...fields: string[]) {
    const h = hash(key);
    if (!fields.some((f) => h.has(f))) return null;
    return Object.fromEntries(fields.map((f) => [f, h.has(f) ? revive(h.get(f)) : null]));
  }
  hdel(key: string, field: string) {
    return Promise.resolve(hash(key).delete(field) ? 1 : 0);
  }
  zadd(key: string, { score, member }: { score: number; member: string }) {
    zset(key).set(member, score);
    return Promise.resolve(1);
  }
  zrem(key: string, member: string) {
    return Promise.resolve(zset(key).delete(member) ? 1 : 0);
  }
  async zcard(key: string) {
    return zset(key).size;
  }
  async zrange(key: string, start: number, stop: number, opts?: { rev?: boolean }) {
    const members = [...zset(key).entries()].sort((a, b) => (opts?.rev ? b[1] - a[1] : a[1] - b[1])).map(([m]) => m);
    return members.slice(start, stop + 1);
  }
  async set(key: string, value: string) {
    data.set(key, value);
    return "OK";
  }
  async get(key: string) {
    return data.has(key) ? revive(data.get(key)) : null;
  }
  multi() {
    const ops: (() => Promise<unknown>)[] = [];
    const tx = {
      hset: (k: string, f: Record<string, string>) => (ops.push(() => this.hset(k, f)), tx),
      hdel: (k: string, f: string) => (ops.push(() => this.hdel(k, f)), tx),
      zadd: (k: string, m: { score: number; member: string }) => (ops.push(() => this.zadd(k, m)), tx),
      zrem: (k: string, m: string) => (ops.push(() => this.zrem(k, m)), tx),
      exec: async () => Promise.all(ops.map((op) => op())),
    };
    return tx;
  }
}

vi.mock("@upstash/redis", () => ({ Redis: FakeRedis }));
process.env.UPSTASH_REDIS_REST_URL = "https://fake.upstash.test";
process.env.UPSTASH_REDIS_REST_TOKEN = "fake";

const { getVisitor, hasStorage, hideVisitor, listVisitors, signVisitor } = await import("./store");
const { markScanned, scanInfo, wasScanned } = await import("@/lib/scan-store");

const D = "2026-11-17";

/** Writes a stamp straight into the store, as older code (or a bad hand edit) may have left it. */
function plant(entry: Record<string, unknown>) {
  hash("visitors:entries").set(String(entry.id), JSON.stringify(entry));
  zset("visitors:order").set(String(entry.id), Number(entry.n));
}

describe("visitor store (Redis)", () => {
  it("uses durable storage", () => {
    expect(hasStorage()).toBe(true);
  });

  it("numbers, dates, lists newest first, hides and keeps the hidden stamp aside", async () => {
    const a = await signVisitor({ name: "Ada", line: "", cat: "hype", d: "2026-11-16" });
    const b = await signVisitor({ name: "Bo", line: "hi", cat: "sus", d: D });
    expect([a.n, b.n]).toEqual([1, 2]);
    expect([a.d, b.d]).toEqual(["2026-11-16", D]);
    expect(revive(hash("visitors:entries").get(b.id))).toEqual(b);
    expect(await listVisitors()).toEqual({ entries: [b, a], total: 2, next: 3 });
    expect(await listVisitors(1)).toEqual({ entries: [b], total: 2, next: 3 });
    expect(await getVisitor(a.id)).toEqual(a);

    expect(await hideVisitor(a.id)).toBe(true);
    expect(await hideVisitor(a.id)).toBe(false);
    expect(await getVisitor(a.id)).toBeNull();
    // The hidden stamp keeps No. 1: the next visitor is No. 3, not total + 1.
    expect(await listVisitors()).toEqual({ entries: [b], total: 1, next: 3 });
    expect(revive(hash("visitors:hidden").get(a.id))).toEqual(a);
    const c = await signVisitor({ name: "Cy", line: "", cat: "hype", d: D });
    expect(c.n).toBe(3);
    expect((await listVisitors()).next).toBe(4);
  });

  it("returns an empty passport when nothing is signed, with No. 1 up next", async () => {
    data.clear();
    expect(await listVisitors()).toEqual({ entries: [], total: 0, next: 1 });
  });

  it("keeps counting when every stamp is hidden", async () => {
    data.clear();
    const a = await signVisitor({ name: "Ada", line: "", cat: "hype", d: D });
    await hideVisitor(a.id);
    expect(await listVisitors()).toEqual({ entries: [], total: 0, next: 2 });
  });

  it("reads stamps from before dates existed", async () => {
    data.clear();
    data.set("visitors:n", 1);
    plant({ id: "old-stamp", n: 1, name: "Ada", line: "first!", cat: "hype" });
    const b = await signVisitor({ name: "Bo", line: "", cat: "sus", d: D });
    const { entries, total, next } = await listVisitors();
    expect(entries).toEqual([b, { id: "old-stamp", n: 1, name: "Ada", line: "first!", cat: "hype" }]);
    expect("d" in entries[1]).toBe(false);
    expect([total, next]).toEqual([2, 3]);
    expect(await getVisitor("old-stamp")).toEqual({ id: "old-stamp", n: 1, name: "Ada", line: "first!", cat: "hype" });
  });

  it("drops a malformed date and keeps the stamp", async () => {
    data.clear();
    data.set("visitors:n", 6);
    const bad = ["2026-02-30", "17 Nov 2026", 20261117, null, "2026-11-17T10:00:00Z", ""];
    bad.forEach((d, i) => plant({ id: `bad${i}`, n: i + 1, name: `V${i}`, line: "", cat: "hype", d }));
    const { entries, total, next } = await listVisitors();
    expect([total, next]).toEqual([6, 7]);
    expect(entries.map((e) => e.id)).toEqual(["bad5", "bad4", "bad3", "bad2", "bad1", "bad0"]);
    for (const e of entries) expect("d" in e, e.id).toBe(false);
    expect(await getVisitor("bad0")).toEqual({ id: "bad0", n: 1, name: "V0", line: "", cat: "hype" });
    // Hiding one keeps it aside without the bad date.
    expect(await hideVisitor("bad0")).toBe(true);
    expect(revive(hash("visitors:hidden").get("bad0"))).toEqual({ id: "bad0", n: 1, name: "V0", line: "", cat: "hype" });
  });

  it("stores and returns the time of signing", async () => {
    data.clear();
    const a = await signVisitor({ name: "Ada", line: "", cat: "hype", d: D, tm: "22:14" });
    const b = await signVisitor({ name: "Bo", line: "", cat: "sus", d: D });
    expect(a.tm).toBe("22:14");
    expect("tm" in b).toBe(false);
    expect(revive(hash("visitors:entries").get(a.id))).toEqual(a);
    expect(await listVisitors()).toEqual({ entries: [b, a], total: 2, next: 3 });
    expect(await getVisitor(a.id)).toEqual(a);
    expect(await hideVisitor(a.id)).toBe(true);
    expect(revive(hash("visitors:hidden").get(a.id))).toEqual(a);
  });

  it("reads dated stamps from before times existed", async () => {
    data.clear();
    data.set("visitors:n", 1);
    plant({ id: "dated", n: 1, name: "Ada", line: "", cat: "hype", d: D });
    expect(await getVisitor("dated")).toEqual({ id: "dated", n: 1, name: "Ada", line: "", cat: "hype", d: D });
  });

  it("drops a malformed time and keeps the stamp (and its date)", async () => {
    data.clear();
    const bad = ["24:00", "9:41", "12:60", "22:14:05", "", null, 2214, "10 pm"];
    data.set("visitors:n", bad.length);
    bad.forEach((tm, i) => plant({ id: `tm${i}`, n: i + 1, name: `V${i}`, line: "", cat: "hype", d: D, tm }));
    const { entries } = await listVisitors();
    expect(entries).toHaveLength(bad.length);
    for (const e of entries) {
      expect("tm" in e, e.id).toBe(false);
      expect(e.d, e.id).toBe(D);
    }
    // A bad date and a bad time on one stamp: both go, the stamp stays.
    plant({ id: "both", n: 99, name: "W", line: "", cat: "hype", d: "nope", tm: "25:00" });
    expect(await getVisitor("both")).toEqual({ id: "both", n: 99, name: "W", line: "", cat: "hype" });
    // A good time survives a bad date.
    plant({ id: "half", n: 100, name: "H", line: "", cat: "hype", d: "nope", tm: "00:00" });
    expect(await getVisitor("half")).toEqual({ id: "half", n: 100, name: "H", line: "", cat: "hype", tm: "00:00" });
  });

  it("still skips entries that aren't stamps at all", async () => {
    data.clear();
    data.set("visitors:n", 2);
    plant({ id: "ok", n: 2, name: "Bo", line: "", cat: "hype", d: D });
    hash("visitors:entries").set("junk", "not json at all {");
    zset("visitors:order").set("junk", 1);
    expect(await listVisitors()).toEqual({ entries: [{ id: "ok", n: 2, name: "Bo", line: "", cat: "hype", d: D }], total: 2, next: 3 });
  });
});

describe("scan store (Redis)", () => {
  it("marks, names, keeps the name on a re-scan, and drops it when the stamp is hidden", async () => {
    expect(await scanInfo("rd01")).toEqual({ scanned: false });
    await markScanned("rd01");
    expect(await wasScanned("rd01")).toBe(true);
    expect(await scanInfo("rd01")).toEqual({ scanned: true });

    const entry = await signVisitor({ name: "Ada", line: "", cat: "hype", d: D });
    await markScanned("rd01", entry.name, entry.id);
    await markScanned("rd01");
    expect(await scanInfo("rd01")).toEqual({ scanned: true, name: "Ada" });
    await hideVisitor(entry.id);
    expect(await scanInfo("rd01")).toEqual({ scanned: true });
  });

  it("reads older bare-timestamp values as scanned", async () => {
    data.set("scan:old1", "1731800000000");
    expect(await scanInfo("old1")).toEqual({ scanned: true });
  });
});
