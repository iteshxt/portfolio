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

describe("visitor store (Redis)", () => {
  it("uses durable storage", () => {
    expect(hasStorage()).toBe(true);
  });

  it("numbers, lists newest first, hides and keeps the hidden stamp aside", async () => {
    const a = await signVisitor({ name: "Ada", line: "", cat: "hype" });
    const b = await signVisitor({ name: "Bo", line: "hi", cat: "sus" });
    expect([a.n, b.n]).toEqual([1, 2]);
    expect(await listVisitors()).toEqual({ entries: [b, a], total: 2 });
    expect((await listVisitors(1)).entries).toEqual([b]);
    expect(await getVisitor(a.id)).toEqual(a);

    expect(await hideVisitor(a.id)).toBe(true);
    expect(await hideVisitor(a.id)).toBe(false);
    expect(await getVisitor(a.id)).toBeNull();
    expect(await listVisitors()).toEqual({ entries: [b], total: 1 });
    expect(revive(hash("visitors:hidden").get(a.id))).toEqual(a);
    expect((await signVisitor({ name: "Cy", line: "", cat: "hype" })).n).toBe(3);
  });

  it("returns an empty passport when nothing is signed", async () => {
    data.clear();
    expect(await listVisitors()).toEqual({ entries: [], total: 0 });
  });
});

describe("scan store (Redis)", () => {
  it("marks, names, keeps the name on a re-scan, and drops it when the stamp is hidden", async () => {
    expect(await scanInfo("rd01")).toEqual({ scanned: false });
    await markScanned("rd01");
    expect(await wasScanned("rd01")).toBe(true);
    expect(await scanInfo("rd01")).toEqual({ scanned: true });

    const entry = await signVisitor({ name: "Ada", line: "", cat: "hype" });
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
