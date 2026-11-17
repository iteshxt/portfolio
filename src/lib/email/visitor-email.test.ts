import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Never reach Resend from a test.
const send = vi.fn(async (payload: unknown) => ({ data: { id: String(Boolean(payload)) }, error: null }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const { hideLink, sendVisitorEmail, visitorHtml, visitorSubject, visitorText } = await import("./visitor-email");

const entry = { id: "abc_DEF-123", n: 142, name: `<b>Ada</b> & "co"`, line: "<img src=x onerror=alert(1)>", cat: "hype" as const };
const env = { ...process.env };

describe("new-stamp email", () => {
  beforeEach(() => {
    process.env.VISITOR_HIDE_SECRET = "test-secret";
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_TO_EMAIL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    send.mockClear();
  });
  afterEach(() => {
    process.env = { ...env };
  });

  it("numbers the subject", () => {
    expect(visitorSubject(entry)).toBe(`New stamp in the passport: <b>Ada</b> & "co" (No. 0142)`);
  });

  it("escapes everything the visitor typed", () => {
    const html = visitorHtml(entry);
    expect(html).not.toContain("<b>Ada</b>");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;b&gt;Ada&lt;/b&gt; &amp; &quot;co&quot;");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(html).toContain("Visitor No. 0142");
  });

  it("links to the hide confirm page with a signed token", () => {
    const link = hideLink(entry) as string;
    expect(link).toMatch(/^https:\/\/iteshxt\.me\/visitors\/hide\?id=abc_DEF-123&t=[A-Za-z0-9_-]{32,}$/);
    expect(visitorHtml(entry)).toContain(link.replace("&", "&amp;"));
    expect(visitorText(entry)).toContain(link);
  });

  it("uses the configured site", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000/";
    expect(hideLink(entry)).toMatch(/^http:\/\/localhost:3000\/visitors\/hide\?/);
  });

  it("has no hide link without a key", () => {
    delete process.env.VISITOR_HIDE_SECRET;
    expect(hideLink(entry)).toBeNull();
    expect(visitorText(entry)).toContain("Hide links need");
  });

  it("skips sending when Resend isn't configured", async () => {
    expect(await sendVisitorEmail(entry)).toBe(false);
    expect(send).not.toHaveBeenCalled();
  });

  it("sends to the owner when configured (mocked)", async () => {
    process.env.RESEND_API_KEY = "re_fake";
    process.env.CONTACT_TO_EMAIL = "owner@example.com";
    expect(await sendVisitorEmail(entry)).toBe(true);
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][0]).toMatchObject({ to: "owner@example.com", subject: visitorSubject(entry) });
  });

  it("never throws into the request", async () => {
    process.env.RESEND_API_KEY = "re_fake";
    process.env.CONTACT_TO_EMAIL = "owner@example.com";
    send.mockRejectedValueOnce(new Error("network"));
    expect(await sendVisitorEmail(entry)).toBe(false);
  });
});
