import { describe, expect, it } from "vitest";
import { KONAMI, konamiStep } from "./konami";
import { complete, runCommand, type TermContext } from "./terminal";

const ctx: TermContext = { shift: "day", date: new Date(2026, 10, 12, 14, 5), now: { repo: "cineflex-app", message: "fix: why does this work" } };

describe("runCommand", () => {
  it("lists commands with help", () => {
    expect(runCommand("help", ctx).lines[0].text).toBe("commands");
  });

  it("navigates with open", () => {
    expect(runCommand("open arcee", ctx).action).toEqual({ type: "navigate", href: "/work/arcee", label: "Arcee" });
    expect(runCommand("open github", ctx).action?.type).toBe("external");
    expect(runCommand("open nowhere", ctx).lines[0].tone).toBe("error");
  });

  it("refuses rm -rf with attitude", () => {
    expect(runCommand("rm -rf /", ctx).lines[0].text).toContain("permission denied, forever");
    expect(runCommand("rm -fr ~", ctx).lines[0].text).toContain("permission denied, forever");
  });

  it("hires itesh via sudo and heads to contact", () => {
    const r = runCommand("sudo hire itesh", ctx);
    expect(r.action).toEqual({ type: "navigate", href: "/contact", label: "Contact" });
    expect(r.delay).toBeGreaterThan(0);
  });

  it("switches the theme, but not to the current one", () => {
    expect(runCommand("theme dark", ctx).action).toEqual({ type: "shift", value: "night" });
    expect(runCommand("shift night", ctx).action).toEqual({ type: "shift", value: "night" });
    expect(runCommand("shift day", ctx).action).toBeUndefined();
  });

  it("knows about 3am", () => {
    const late = runCommand("date", { ...ctx, date: new Date(2026, 10, 12, 3, 10) });
    expect(late.lines[1].text).toContain("why are you awake");
  });

  it("shows the latest push, or admits there isn't one", () => {
    expect(runCommand("now", ctx).lines[0].text).toContain("cineflex-app");
    expect(runCommand("now", { ...ctx, now: null }).lines[0].text).toContain("suspicious");
  });

  it("handles unknown commands and empty input", () => {
    expect(runCommand("hack", ctx).lines[0].text).toContain("command not found: hack");
    expect(runCommand("   ", ctx).lines).toEqual([]);
  });
});

describe("complete", () => {
  it("completes commands and arguments", () => {
    expect(complete("who")).toBe("whoami ");
    expect(complete("open pat")).toBe("open patentiq");
    expect(complete("theme d")).toBe("theme dark");
    expect(complete("th")).toBe("theme ");
    expect(complete("e")).toBeNull();
  });
});

describe("konamiStep", () => {
  it("matches the full sequence", () => {
    let p = 0;
    for (const k of KONAMI) p = konamiStep(p, k);
    expect(p).toBe(KONAMI.length);
  });

  it("accepts B/A in any case and survives extra ups", () => {
    let p = 0;
    for (const k of ["ArrowUp", "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "B", "A"]) {
      p = konamiStep(p, k);
    }
    expect(p).toBe(KONAMI.length);
  });

  it("resets on a wrong key", () => {
    expect(konamiStep(5, "x")).toBe(0);
  });
});
