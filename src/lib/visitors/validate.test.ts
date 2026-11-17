import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CONTACT_MESSAGE,
  FRIENDLY_MESSAGE,
  hasContactDetails,
  isCalendarDate,
  isUnfriendly,
  normalize,
  resolveVisitDate,
  resolveVisitMoment,
  utcDate,
  validateCard,
  validateLine,
  validateName,
} from "./validate";

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
    expect(validateLine("Saw the barcode, had to scan it! 🐈 (no regrets)")).toMatchObject({ ok: true });
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

describe("visit date", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const at = (iso: string) => new Date(iso);
  /** The calendar date on a wall clock at this UTC offset (hours). */
  const localDate = (now: Date, offset: number) => utcDate(new Date(now.getTime() + offset * 3_600_000));

  it("keeps the visitor's date when it's the server's UTC date", () => {
    expect(resolveVisitDate("2026-11-17", at("2026-11-17T12:00:00Z"))).toBe("2026-11-17");
  });

  it("keeps a date one day either side, as far apart as time zones go", () => {
    // Kiribati (UTC+14) is already on the 18th at 10:30 UTC; Baker Island (UTC-12) is still on the 16th at 11:30 UTC.
    expect(resolveVisitDate("2026-11-18", at("2026-11-17T10:30:00Z"))).toBe("2026-11-18");
    expect(resolveVisitDate("2026-11-16", at("2026-11-17T11:30:00Z"))).toBe("2026-11-16");
    // Either side of UTC midnight.
    expect(resolveVisitDate("2026-11-16", at("2026-11-17T00:00:00Z"))).toBe("2026-11-16");
    expect(resolveVisitDate("2026-11-18", at("2026-11-17T23:59:59.999Z"))).toBe("2026-11-18");
    expect(resolveVisitDate("2026-11-18", at("2026-11-17T00:00:00Z"))).toBe("2026-11-18");
    expect(resolveVisitDate("2026-11-16", at("2026-11-17T23:59:59.999Z"))).toBe("2026-11-16");
  });

  it("believes every time zone, at every hour of the UTC day", () => {
    for (let minute = 0; minute < 24 * 60; minute += 15) {
      const now = new Date(Date.UTC(2026, 10, 17, 0, minute));
      for (let offset = -12; offset <= 14; offset += 0.25) {
        const local = localDate(now, offset);
        expect(resolveVisitDate(local, now), `${now.toISOString()} at UTC${offset >= 0 ? "+" : ""}${offset}`).toBe(local);
      }
    }
  });

  it("crosses month, year and leap-day boundaries", () => {
    expect(resolveVisitDate("2027-01-01", at("2026-12-31T20:00:00Z"))).toBe("2027-01-01");
    expect(resolveVisitDate("2026-12-31", at("2027-01-01T03:00:00Z"))).toBe("2026-12-31");
    expect(resolveVisitDate("2026-12-01", at("2026-11-30T15:00:00Z"))).toBe("2026-12-01");
    expect(resolveVisitDate("2028-02-29", at("2028-03-01T05:00:00Z"))).toBe("2028-02-29");
    expect(resolveVisitDate("2028-03-01", at("2028-02-29T18:00:00Z"))).toBe("2028-03-01");
  });

  it("falls back to the server's UTC date two or more days off", () => {
    const now = at("2026-11-17T12:00:00Z");
    expect(resolveVisitDate("2026-11-19", now)).toBe("2026-11-17");
    expect(resolveVisitDate("2026-11-15", now)).toBe("2026-11-17");
    expect(resolveVisitDate("2025-11-17", now)).toBe("2026-11-17");
    expect(resolveVisitDate("1970-01-01", now)).toBe("2026-11-17");
    expect(resolveVisitDate("0000-01-01", now)).toBe("2026-11-17");
    expect(resolveVisitDate("9999-12-31", now)).toBe("2026-11-17");
  });

  it("refuses days that don't exist instead of rolling them over", () => {
    expect(resolveVisitDate("2026-02-29", at("2026-02-28T12:00:00Z"))).toBe("2026-02-28");
    expect(resolveVisitDate("2026-02-30", at("2026-03-01T12:00:00Z"))).toBe("2026-03-01");
    expect(resolveVisitDate("2026-11-31", at("2026-12-01T12:00:00Z"))).toBe("2026-12-01");
    expect(resolveVisitDate("2026-11-00", at("2026-11-01T12:00:00Z"))).toBe("2026-11-01");
    expect(resolveVisitDate("2026-13-01", at("2026-12-31T12:00:00Z"))).toBe("2026-12-31");
    expect(resolveVisitDate("2026-00-17", at("2026-11-17T12:00:00Z"))).toBe("2026-11-17");
  });

  it("falls back on junk and on anything that isn't a plain date", () => {
    const now = at("2026-11-17T12:00:00Z");
    for (const junk of [
      "",
      "today",
      "2026-11-17T00:00",
      "2026-11-17T09:41:00+05:30",
      " 2026-11-17",
      "2026-11-17 ",
      "2026/11/17",
      "17-11-2026",
      "2026-1-17",
      "+02026-11-17",
      "２０２６-１１-１７",
      "2026-11-17\n",
    ]) {
      expect(resolveVisitDate(junk, now), JSON.stringify(junk)).toBe("2026-11-17");
    }
  });

  it("falls back on wrong types", () => {
    const now = at("2026-11-17T12:00:00Z");
    for (const value of [undefined, null, 20261117, true, {}, [], ["2026-11-17"], now, { toString: () => "2026-11-17" }]) {
      expect(resolveVisitDate(value, now)).toBe("2026-11-17");
    }
  });

  it("uses the current UTC date by default", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(at("2026-11-17T23:30:00Z"));
    expect(resolveVisitDate(undefined)).toBe("2026-11-17");
    expect(resolveVisitDate("2026-11-18")).toBe("2026-11-18");
  });

  it("knows a calendar date from a lookalike", () => {
    expect(isCalendarDate("2028-02-29")).toBe(true);
    expect(isCalendarDate("2026-02-29")).toBe(false);
    expect(isCalendarDate("2026-11-17T00:00:00Z")).toBe(false);
    expect(isCalendarDate(20261117)).toBe(false);
  });
});

describe("visit moment", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const NOW = new Date("2026-11-17T16:44:05Z");
  const moment = (at: unknown, date?: unknown, now = NOW) => resolveVisitMoment(at, date, now);

  it("keeps the visitor's wall-clock date and time", () => {
    expect(moment("2026-11-17T22:14:05+05:30")).toEqual({ d: "2026-11-17", tm: "22:14" });
    expect(moment("2026-11-17T16:44:05Z")).toEqual({ d: "2026-11-17", tm: "16:44" });
    expect(moment("2026-11-17T11:44:05-05:00")).toEqual({ d: "2026-11-17", tm: "11:44" });
    expect(moment("2026-11-17T17:44+01:00")).toEqual({ d: "2026-11-17", tm: "17:44" });
    expect(moment("2026-11-17T16:44:05.123Z")).toEqual({ d: "2026-11-17", tm: "16:44" });
    expect(moment("2026-11-17T16:44:05.1Z")).toEqual({ d: "2026-11-17", tm: "16:44" });
  });

  it("takes the visitor's calendar day, even when it isn't the server's", () => {
    // Auckland in daylight time is already on tomorrow.
    expect(moment("2026-11-18T05:44:05+13:00")).toEqual({ d: "2026-11-18", tm: "05:44" });
    expect(moment("2026-11-18T06:44:05+14:00")).toEqual({ d: "2026-11-18", tm: "06:44" });
    expect(moment("2026-11-17T04:44:05-12:00")).toEqual({ d: "2026-11-17", tm: "04:44" });
    const lateUtc = new Date("2026-11-17T23:50:00Z");
    const earlyUtc = new Date("2026-11-17T00:10:00Z");
    expect(moment("2026-11-16T12:10:00-12:00", undefined, earlyUtc)).toEqual({ d: "2026-11-16", tm: "12:10" });
    expect(moment("2026-11-18T13:50:00+14:00", undefined, lateUtc)).toEqual({ d: "2026-11-18", tm: "13:50" });
  });

  it("accepts offsets right at the edges of real time zones and nothing past them", () => {
    expect(moment("2026-11-18T06:44:05+14:00").tm).toBe("06:44");
    expect(moment("2026-11-17T04:44:05-12:00").tm).toBe("04:44");
    expect(moment("2026-11-18T06:45:05+14:01")).toEqual({ d: "2026-11-17" });
    expect(moment("2026-11-17T04:43:05-12:01")).toEqual({ d: "2026-11-17" });
    expect(moment("2026-11-18T07:44:05+15:00")).toEqual({ d: "2026-11-17" });
    expect(moment("2026-11-17T03:44:05-13:00")).toEqual({ d: "2026-11-17" });
    expect(moment("2026-11-17T22:29:05+05:45").tm).toBe("22:29");
    expect(moment("2026-11-17T16:44:05-00:00").tm).toBe("16:44");
    expect(moment("2026-11-17T16:44:05+00:00").tm).toBe("16:44");
    // Offset minutes past 59 aren't an offset.
    expect(moment("2026-11-17T17:44:05+00:60")).toEqual({ d: "2026-11-17" });
  });

  it("allows a clock up to 15 minutes off, and no more", () => {
    expect(moment("2026-11-17T16:59:05Z").tm).toBe("16:59");
    expect(moment("2026-11-17T16:29:05Z").tm).toBe("16:29");
    expect(moment("2026-11-17T22:29:05+05:30").tm).toBe("22:29");
    expect(moment("2026-11-17T16:59:06Z")).toEqual({ d: "2026-11-17" });
    expect(moment("2026-11-17T16:29:04Z")).toEqual({ d: "2026-11-17" });
    expect(moment("2026-11-17T17:44:05Z")).toEqual({ d: "2026-11-17" });
    // The right wall clock with the wrong offset names the wrong instant.
    expect(moment("2026-11-17T22:14:05Z")).toEqual({ d: "2026-11-17" });
    expect(moment("2026-11-17T16:44:05+05:30")).toEqual({ d: "2026-11-17" });
    expect(moment("2025-11-17T16:44:05Z")).toEqual({ d: "2026-11-17" });
  });

  it("falls back to the date field (and no time) when the moment won't do", () => {
    expect(moment("2026-11-17T22:14:05Z", "2026-11-18")).toEqual({ d: "2026-11-18" });
    expect(moment(undefined, "2026-11-16")).toEqual({ d: "2026-11-16" });
    expect(moment(undefined, "2026-11-20")).toEqual({ d: "2026-11-17" });
    expect(moment(undefined, undefined)).toEqual({ d: "2026-11-17" });
    expect("tm" in moment("junk", "2026-11-17")).toBe(false);
  });

  it("refuses times and dates that don't exist", () => {
    const now = new Date("2026-11-17T00:00:00Z");
    expect(moment("2026-11-17T24:00:00Z", undefined, new Date("2026-11-18T00:00:00Z"))).toEqual({ d: "2026-11-18" });
    expect(moment("2026-11-16T23:60:00Z", undefined, now)).toEqual({ d: "2026-11-17" });
    expect(moment("2026-11-16T23:59:60Z", undefined, now)).toEqual({ d: "2026-11-17" });
    expect(moment("2026-11-16T99:00:00Z", undefined, now)).toEqual({ d: "2026-11-17" });
    expect(moment("2026-02-29T12:00:00Z", undefined, new Date("2026-03-01T12:00:00Z"))).toEqual({ d: "2026-03-01" });
    expect(moment("2026-02-30T12:00:00Z", undefined, new Date("2026-03-02T12:00:00Z"))).toEqual({ d: "2026-03-02" });
    expect(moment("2026-13-01T00:00:00Z", undefined, new Date("2027-01-01T00:00:00Z"))).toEqual({ d: "2027-01-01" });
    // A real leap day does count.
    expect(moment("2028-02-29T12:00:00Z", undefined, new Date("2028-02-29T12:05:00Z"))).toEqual({ d: "2028-02-29", tm: "12:00" });
  });

  it("falls back on junk", () => {
    for (const junk of [
      "",
      "now",
      "2026-11-17",
      "2026-11-17T16:44:05",
      "2026-11-17 16:44:05Z",
      "2026-11-17t16:44:05z",
      "2026-11-17T16:44:05+0530",
      "2026-11-17T16:44:05+05",
      "2026-11-17T16:44:05.1234Z",
      "2026-11-17T16:44:5Z",
      "2026-11-17T6:44:05Z",
      " 2026-11-17T16:44:05Z",
      "2026-11-17T16:44:05Z ",
      "2026-11-17T16:44:05Z\n",
      "+002026-11-17T16:44:05Z",
      "２０２６-11-17T16:44:05Z",
      "2026-11-17T16:44:05Z[Asia/Kolkata]",
    ]) {
      expect(moment(junk, "2026-11-17"), JSON.stringify(junk)).toEqual({ d: "2026-11-17" });
    }
  });

  it("falls back on wrong types", () => {
    for (const value of [undefined, null, 1_763_397_845_000, true, {}, [], ["2026-11-17T16:44:05Z"], NOW, { toString: () => "2026-11-17T16:44:05Z" }]) {
      expect(moment(value, "2026-11-17")).toEqual({ d: "2026-11-17" });
    }
  });

  it("uses the current time by default", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    expect(resolveVisitMoment("2026-11-17T22:14:05+05:30", undefined)).toEqual({ d: "2026-11-17", tm: "22:14" });
    expect(resolveVisitMoment("2026-11-17T23:14:05+05:30", undefined)).toEqual({ d: "2026-11-17" });
  });
});
