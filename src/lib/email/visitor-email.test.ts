import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Never reach Resend from a test.
const send = vi.fn(async (payload: unknown) => ({ data: { id: String(Boolean(payload)) }, error: null }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const { formatVisitDate, formatVisitMoment, hideLink, sendVisitorEmail, visitorHtml, visitorSubject, visitorText } = await import("./visitor-email");

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

  it("prints the day they signed, when the stamp has one", () => {
    const dated = { ...entry, d: "2026-11-17" };
    expect(visitorText(dated)).toContain("Signed on: 17 Nov 2026");
    expect(visitorText(dated).split("\n").slice(0, 3)).toEqual([
      `Visitor No. 0142: <b>Ada</b> & "co"`,
      "Signed on: 17 Nov 2026",
      "Reason for visit: <img src=x onerror=alert(1)>",
    ]);
    expect(visitorHtml(dated)).toContain("ADMITTED &middot; 17 Nov 2026</div>");
    // Undated (older) stamps: no date line, no dangling separator.
    expect(visitorText(entry)).not.toContain("Signed on");
    expect(visitorHtml(entry)).toContain(">ADMITTED</div>");
    expect(visitorHtml(entry)).not.toContain("&middot;");
  });

  it("prints the time next to the date, when the stamp has one", () => {
    const timed = { ...entry, d: "2026-11-17", tm: "22:14" };
    expect(visitorText(timed).split("\n")[1]).toBe("Signed on: 17 Nov 2026, 22:14");
    expect(visitorHtml(timed)).toContain("ADMITTED &middot; 17 Nov 2026, 22:14</div>");
    // A time without a date has nothing to sit next to.
    expect(visitorText({ ...entry, tm: "22:14" })).not.toContain("Signed on");
    expect(visitorHtml({ ...entry, tm: "22:14" })).toContain(">ADMITTED</div>");
  });

  it("formats the visit moment: date, then time when there's a well-formed one", () => {
    expect(formatVisitMoment({ d: "2026-11-17", tm: "22:14" })).toBe("17 Nov 2026, 22:14");
    expect(formatVisitMoment({ d: "2026-11-17", tm: "00:00" })).toBe("17 Nov 2026, 00:00");
    expect(formatVisitMoment({ d: "2026-11-17", tm: "23:59" })).toBe("17 Nov 2026, 23:59");
    expect(formatVisitMoment({ d: "2026-11-17" })).toBe("17 Nov 2026");
    for (const tm of ["24:00", "9:41", "12:60", "", "22:14:05", "<b>"]) {
      expect(formatVisitMoment({ d: "2026-11-17", tm }), tm).toBe("17 Nov 2026");
    }
    expect(formatVisitMoment({ tm: "22:14" })).toBeNull();
    expect(formatVisitMoment({ d: "nope", tm: "22:14" })).toBeNull();
  });

  it("formats visit dates without a time zone getting in the way", () => {
    expect(formatVisitDate("2026-11-17")).toBe("17 Nov 2026");
    expect(formatVisitDate("2027-01-01")).toBe("1 Jan 2027");
    expect(formatVisitDate("2028-02-29")).toBe("29 Feb 2028");
    expect(formatVisitDate("2026-12-31")).toBe("31 Dec 2026");
    for (const bad of [undefined, "", "2026-13-01", "2026-00-10", "2026-11-00", "2026-11-32", "17 Nov 2026", "2026-11-17T00:00:00Z"]) {
      expect(formatVisitDate(bad), String(bad)).toBeNull();
    }
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
