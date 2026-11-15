import { describe, expect, it } from "vitest";
import { escapeHtml, messageHtml, messageSubject, messageText } from "./message-email";

const base = { name: "Bobby <b>", contact: "bobby@gmail.com", message: "hi <script>alert(1)</script>\nsecond line", via: "postcard" as const, sentAt: new Date("2026-11-15T19:04:00Z") };

describe("message email", () => {
  it("escapes everything the visitor typed", () => {
    const html = messageHtml(base);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Bobby &lt;b&gt;");
    expect(escapeHtml(`"'&`)).toBe("&quot;&#39;&amp;");
  });
  it("keeps line breaks, stamps the time in IST and offers a reply", () => {
    const html = messageHtml(base);
    expect(html).toContain("<br>second line");
    expect(html).toContain("16 NOV 2026 · 00:34 IST");
    expect(html).toContain("mailto:bobby%40gmail.com");
  });
  it("shows a non-email contact instead of a reply button", () => {
    const html = messageHtml({ ...base, contact: "@bobby on X" });
    expect(html).not.toContain("mailto:");
    expect(html).toContain("Reach them at: @bobby on X");
  });
  it("names where it came from", () => {
    expect(messageSubject({ name: "Sam", via: "arcee" })).toBe("Sam left you a message with Arcee");
    expect(messageText({ ...base, via: "arcee" })).toContain("through Arcee");
  });
});
