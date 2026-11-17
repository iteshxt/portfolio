import { describe, expect, it } from "vitest";
import { CONTACT_MESSAGE, FRIENDLY_MESSAGE, hasContactDetails, isUnfriendly, normalize, validateCard, validateLine, validateName } from "./validate";

describe("normalize", () => {
  it("folds to one trimmed line with single spaces", () => {
    expect(normalize("  Ada \n\t Lovelace  ")).toBe("Ada Lovelace");
    expect(normalize("a\r\nb")).toBe("a b");
  });

  it("strips control and invisible characters", () => {
    expect(normalize("Ad\u0000a")).toBe("Ada");
    expect(normalize("fu​ck")).toBe("fuck");
    expect(normalize("‮evil‬")).toBe("evil");
    expect(normalize("soft­hyphen")).toBe("softhyphen");
  });

  it("keeps emoji sequences joined", () => {
    expect(normalize("👩‍💻 coding")).toBe("👩‍💻 coding");
    expect(normalize("a‍b")).toBe("ab");
  });

  it("drops fillers, blanks and stray variation selectors", () => {
    expect(normalize("\u3164")).toBe("");
    expect(normalize("\u2800 hi \u115f")).toBe("hi");
    expect(normalize("A\u{E0100}da")).toBe("Ada");
    expect(normalize("Ad\ufe0fa")).toBe("Ada");
    expect(normalize("\u2764\ufe0f and 1\ufe0f\u20e3")).toBe("\u2764\ufe0f and 1\ufe0f\u20e3");
  });

  it("composes to NFC", () => {
    expect(normalize("Café")).toBe("Café");
  });
});

describe("names", () => {
  it("accepts names in any script", () => {
    for (const n of ["Ada", "Zoë O'Brien", "José-María", "Priya Sharma", "प्रिया", "李雷", "Anne & Bob", "R2-D2", "o’neil_99!"]) {
      expect(validateName(n)).toEqual({ ok: true, value: n });
    }
  });

  it("enforces length in code points", () => {
    expect(validateName("   ").ok).toBe(false);
    expect(validateName("a".repeat(24)).ok).toBe(true);
    expect(validateName("a".repeat(25))).toMatchObject({ ok: false, error: "invalid" });
  });

  it("refuses symbols and punctuation-only names", () => {
    expect(validateName("<script>")).toMatchObject({ ok: false, error: "invalid" });
    expect(validateName("Ada 😀")).toMatchObject({ ok: false, error: "invalid" });
    expect(validateName("...")).toMatchObject({ ok: false, error: "invalid" });
  });

  it("refuses blank-looking and Zalgo names", () => {
    expect(validateName("\u3164")).toMatchObject({ ok: false, error: "invalid" });
    expect(validateName("\u2800\u2800")).toMatchObject({ ok: false, error: "invalid" });
    expect(validateName(`a${"\u0336".repeat(20)}`)).toMatchObject({ ok: false, error: "invalid" });
    expect(validateName("हैं ठीक")).toMatchObject({ ok: true });
  });
});

describe("reason for visit", () => {
  it("is optional and allows punctuation and emoji", () => {
    expect(validateLine(undefined)).toEqual({ ok: true, value: "" });
    expect(validateLine("Saw the QR, had to scan it! 🐈 (no regrets)")).toMatchObject({ ok: true });
  });

  it("has a length cap", () => {
    expect(validateLine("x".repeat(80)).ok).toBe(true);
    expect(validateLine("x".repeat(81))).toMatchObject({ ok: false, error: "invalid" });
  });

  it("refuses mark towers and keeps invisible padding out", () => {
    expect(validateLine(`z${"\u0489".repeat(79)}`)).toMatchObject({ ok: false, error: "invalid" });
    expect(validateLine("\u2800\u2800\u2800")).toEqual({ ok: true, value: "" });
  });
});

describe("contact details", () => {
  it.each(["see https://x.dev", "www.example.org", "dm me at example.com", "t.me/someone", "me@mail.com", "ada (at) gmail", "follow @ada_codes", "call 98765 43210", "+1 (555) 123-4567", "example (dot) com",
    "visit ｅｘａｍｐｌｅ．ｃｏｍ", "go to example。com/x", "spam.top/x", "example.de/path", "EXAMPLE.COM", "call ①②③④⑤⑥⑦⑧⑨⑩", "find me at foo.to", "12345678"])(
    "refuses %s",
    (s) => {
      expect(hasContactDetails(s)).toBe(true);
      expect(validateLine(s)).toEqual({ ok: false, error: "rejected", message: CONTACT_MESSAGE });
    },
  );

  it.each(["I visited. In awe", "Node.js fan", "Class of 2024", "c@ts are great", "Room 101", "since 2019", "Hi.Is this real", "love the site.so good", "went to Japan.to see", "Saw it on 2023 2024"])("allows %s", (s) => {
    expect(hasContactDetails(s)).toBe(false);
  });
});

describe("word filter", () => {
  it.each(["fuck", "FUCK off", "motherfucker", "f.u.c.k", "f u c k", "fu ck", "fuuuuck", "sh1t", "a$$", "b!tch", "c u n t", "ｆｕｃｋ", "fück", "fυck",
    "nıgger", "bıtch", "whøre", "słut", "nigger1", "cunt1", "dick1", "chink1", "niggerlover", "shitface", "ni.gger", "n1gg3r"])(
    "catches English abuse: %s",
    (s) => expect(isUnfriendly(s)).toBe(true),
  );

  it.each(["madarchod", "Behenchod", "bhenchod", "chutiya", "chutiyapa", "gandu", "bhosdike", "randi", "lund", "lavde", "lawde", "harami", "b3h3nch0d", "मादरचोद", "चूतिया"])(
    "catches Hindi and Hinglish abuse: %s",
    (s) => expect(isUnfriendly(s)).toBe(true),
  );

  it.each(["class", "assistant", "Scunthorpe", "cocktail", "cockpit", "Dickens", "Matsushita", "shiitake", "Niger", "snigger", "Brandi", "Fukuoka", "Ashit", "Gandhi", "chutney", "bass guitar", "glass of water", "Sussex", "a s a p", "of uk",
    "Room 455 was great", "Flew a 717 in", "summa cum laude", "a bit cheesy", "who reads these", "Gan Du", "niggardly", "sniggering", "Cockburn", "Scunthorpe 1", "assess", "swanker", "china all", "dumb bass"])(
    "lets innocent words through: %s",
    (s) => expect(isUnfriendly(s)).toBe(false),
  );

  it("rejects with a friendly message in both fields", () => {
    expect(validateName("Mr Fuckface")).toEqual({ ok: false, error: "rejected", message: FRIENDLY_MESSAGE });
    expect(validateLine("bhenchod scene")).toEqual({ ok: false, error: "rejected", message: FRIENDLY_MESSAGE });
  });
});

describe("the whole card", () => {
  it("needs one of the cats", () => {
    expect(validateCard({ name: "Ada", cat: "dog" })).toMatchObject({ ok: false, error: "invalid" });
  });

  it("returns the cleaned card", () => {
    expect(validateCard({ name: "  Ada  ", line: " hello\nthere ", cat: "hype" })).toEqual({ ok: true, value: { name: "Ada", line: "hello there", cat: "hype" } });
  });
});
