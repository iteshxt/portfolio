import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { hideToken, verifyHideToken } from "./hide-token";

const saved = { secret: process.env.VISITOR_HIDE_SECRET, resend: process.env.RESEND_API_KEY };

describe("hide tokens", () => {
  beforeEach(() => {
    process.env.VISITOR_HIDE_SECRET = "test-secret";
    delete process.env.RESEND_API_KEY;
  });
  afterEach(() => {
    process.env.VISITOR_HIDE_SECRET = saved.secret;
    process.env.RESEND_API_KEY = saved.resend;
    if (saved.secret === undefined) delete process.env.VISITOR_HIDE_SECRET;
    if (saved.resend === undefined) delete process.env.RESEND_API_KEY;
  });

  it("signs ids as long base64url strings", () => {
    const t = hideToken("abc");
    expect(t).toMatch(/^[A-Za-z0-9_-]{32,}$/);
    expect(hideToken("abc")).toBe(t);
    expect(hideToken("abd")).not.toBe(t);
  });

  it("verifies only the matching id and token", () => {
    const t = hideToken("abc") as string;
    expect(verifyHideToken("abc", t)).toBe(true);
    expect(verifyHideToken("abd", t)).toBe(false);
    expect(verifyHideToken("abc", `${t.slice(0, -1)}x`)).toBe(false);
    expect(verifyHideToken("abc", "short")).toBe(false);
    expect(verifyHideToken("abc", "")).toBe(false);
  });

  it("changes with the key, and falls back to the Resend key", () => {
    const a = hideToken("abc");
    delete process.env.VISITOR_HIDE_SECRET;
    process.env.RESEND_API_KEY = "re_fake";
    const b = hideToken("abc");
    expect(b).not.toBeNull();
    expect(b).not.toBe(a);
  });

  it("offers no links without a key", () => {
    delete process.env.VISITOR_HIDE_SECRET;
    expect(hideToken("abc")).toBeNull();
    expect(verifyHideToken("abc", "anything")).toBe(false);
  });
});
