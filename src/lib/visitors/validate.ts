import { STICKER_MOODS, type StickerMood } from "@/lib/arcee/stickers";
import { LINE_MAX, NAME_MAX } from "./types";

/**
 * Arrival-card checks for the visitors' passport (docs/design.md §2.18). Pure, so the
 * API and the form can share them. Everything is public on /visitors, so beyond length
 * and characters it refuses contact details (no doxxing, no spam links) and abuse in
 * English and Hindi/Hinglish, without Scunthorpe-style false positives.
 */

export type CardResult<T> = { ok: true; value: T } | { ok: false; error: "invalid" | "rejected"; message: string };

export const CONTACT_MESSAGE = "Links and contact details don't go in the passport.";
export const FRIENDLY_MESSAGE = "Let's keep the passport friendly. Try different words.";

const ZWJ = "\u200d";
const VS16 = "\ufe0f";
const KEYCAP = "\u20e3";
const PICTO = /\p{Extended_Pictographic}/u;
/** What may sit between an emoji and a joining ZWJ: variation selector-16 and skin tones. */
const EMOJI_TAIL = /[\ufe0f\u{1F3FB}-\u{1F3FF}]/u;
/**
 * Invisible or blank-looking code points: every Default_Ignorable (Hangul fillers, variation
 * selectors, the combining grapheme joiner, tags) plus the braille blank, which is a symbol.
 */
const INVISIBLE = /[\p{Default_Ignorable_Code_Point}\u2800]/u;

/** A ZWJ survives only inside an emoji sequence (woman technologist: 👩 ZWJ 💻); anywhere else it's an evasion trick. */
function emojiJoin(chars: string[], i: number): boolean {
  let p = i - 1;
  while (p >= 0 && EMOJI_TAIL.test(chars[p])) p--;
  return p >= 0 && PICTO.test(chars[p]) && i + 1 < chars.length && PICTO.test(chars[i + 1]);
}

/** VS16 survives only where it styles an emoji (a red heart) or a keycap (1, VS16, U+20E3), never as a hidden payload. */
function emojiStyle(chars: string[], i: number): boolean {
  return (i > 0 && PICTO.test(chars[i - 1])) || (i > 0 && /[0-9#*]/.test(chars[i - 1]) && chars[i + 1] === KEYCAP);
}

/**
 * NFC, one line, no control, format or invisible characters, single spaces, trimmed.
 * Bidi overrides, zero-width spaces and soft hyphens are \p{Cf}; Hangul fillers and the
 * braille blank would otherwise make a blank-looking name.
 */
export function normalize(input: string): string {
  const chars = Array.from(input.normalize("NFC").replace(/\s+/gu, " "));
  const kept = chars.filter((c, i) => {
    if (/\p{Cc}/u.test(c)) return false;
    if (c === ZWJ) return emojiJoin(chars, i);
    if (c === VS16) return emojiStyle(chars, i);
    return !/\p{Cf}/u.test(c) && !INVISIBLE.test(c);
  });
  return kept.join("").replace(/ {2,}/g, " ").trim();
}

const codePoints = (s: string) => Array.from(s).length;

/**
 * Zalgo: a tower of combining marks bleeds over the neighbouring stamps. Latin, Greek,
 * Cyrillic and symbols never need more than two on one letter; other scripts (Indic,
 * Thai, Hebrew with points) can stack a few, so they get four.
 */
const MARK_TOWER = /[\p{sc=Latin}\p{sc=Greek}\p{sc=Cyrillic}\p{sc=Common}]\p{M}{3,}|\p{M}{5,}/u;

// ---------------------------------------------------------------------------
// Contact details
// ---------------------------------------------------------------------------

/** Top-level domains that aren't also everyday words: a bare "name.tld" is a link. */
const TLDS =
  "com|net|org|io|dev|app|xyz|ai|gg|ly|tv|link|site|online|info|biz|uk|ru|tk|club|shop|store|live|page|sh|top|de|fr|ca|eu|cc|vip|pro|fun|lol|ws|co|cn|jp|br|au|nl|pl|es|ch|se|ir|pk|bd|np|lk|id|vn|ph|nz|fm|gd|im|tech|blog|cloud|space|website|click|icu|xxx|bet|win|art";
/** Domains that are also short words ("Japan.to see", "site.so good"): a link only with a path or at the very end. */
const WORD_TLDS = "me|in|is|so|to|us|it|be|no|go|do|my|am|at|on|an|as|by|he|hi|if|of|or|up|we";
const both = (list: string) => `${list}|${list.toUpperCase()}`;

const CONTACT: RegExp[] = [
  /\b(?:https?|ftp):\/\//iu,
  /\bwww\s*\./iu,
  // example.com, EXAMPLE.COM, t.me/x. A bare dot can't have spaces round it, or "visited. In" would
  // count; a capitalised word after the dot ("Hi.Is") is a missing space, not a domain.
  new RegExp(`[\\p{L}\\p{N}-]\\.(?:${both(TLDS)})(?![\\p{L}\\p{N}])`, "u"),
  new RegExp(`[\\p{L}\\p{N}-]\\.(?:${both(WORD_TLDS)})(?:\\/|$)`, "u"),
  // "example (dot) com".
  new RegExp(`[\\p{L}\\p{N}-]\\s*[([]\\s*dot\\s*[)\\]]\\s*(?:${TLDS}|${WORD_TLDS})(?![\\p{L}\\p{N}])`, "iu"),
  // Emails, and the "name (at) gmail" dodge.
  /[\p{L}\p{N}._%+-]+@[\p{L}\p{N}-]+\.\p{L}{2,}/u,
  /[\p{L}\p{N}]\s*[([]\s*at\s*[)\]]\s*[\p{L}\p{N}]/iu,
  // @handles (but "c@t" stays leetspeak, not a handle).
  /(?:^|[^\p{L}\p{N}_])@[\p{L}\p{N}_.]+/u,
  // Phone numbers: ten or more digits in short groups ("98765 43210", "+1 (555) 123-4567"),
  // or eight packed together. Loose spacing between numbers ("2023 2024") isn't a phone.
  /\+?(?:\d[\s\-.()]{0,2}){9}\d/u,
  /\d(?:[\-.()]?\d){7}/u,
];

/**
 * Checked on the NFKC form, where fullwidth letters (ｅｘａｍｐｌｅ．ｃｏｍ) and circled digits (①)
 * fold to ASCII; ideographic full stops count as dots, as browsers read them in URLs.
 */
export function hasContactDetails(s: string): boolean {
  const folded = s.normalize("NFKC").replace(/[\u3002\uff61\ufe12]/g, ".");
  return CONTACT.some((re) => re.test(folded));
}

// ---------------------------------------------------------------------------
// Word filter
// ---------------------------------------------------------------------------

/**
 * Whole words only: short or ambiguous words that live inside innocent ones
 * ("ass" in class, "cock" in cockpit, "dick" in Dickens, "shit" in Matsushita,
 * "randi" in Brandi). "cum" is left out for "summa cum laude".
 */
const EXACT = [
  // English
  "ass", "asses", "arse", "cunt", "cunts", "cunty", "dick", "dicks", "cock", "cocks", "shit", "shits", "shitty", "shitting", "shitter",
  "fuk", "fuking", "fukin", "fuq", "fck", "fcking", "fking", "tit", "tits", "titties", "jizz", "pussy", "pussies", "slut", "sluts",
  "slutty", "twat", "twats", "wank", "dildo", "fag", "fags", "chink", "chinks", "kike", "kikes", "spic", "spics", "tranny", "trannies",
  "paki", "pakis", "retard", "retards", "retarded", "rape", "rapist",
  // Hindi / Hinglish
  "randi", "randiya", "raand", "randwa", "lund", "lavde", "lawde", "lavda", "lawda", "lodu", "gaand", "chodu", "kutiya", "bhadwa",
  "bhadwe", "bhadve", "chinal", "jhaant", "jhant", "jhaatu", "jhatu", "bkl", "bsdk", "mkc",
];

/** Insult compounds of the whole-word list: shitface, cuntbag, dicklicker. */
const COMPOUND_TAIL = "face|head|hole|bag|stain|lover|lord|sucker|wad|wit|licker|eater|brain";

/** Distinctive enough to catch inside longer words (motherfucker, chutiyapa, bhosdike). */
const INFIX = [
  // English
  "fuck", "fvck", "phuck", "cocksuck", "asshole", "arsehole", "bitch", "whore", "faggot", "dickhead", "shithead", "bullshit", "dumbass",
  "jackass", "bastard", "dipshit", "horseshit", "batshit", "apeshit", "cumshot", "cumslut",
  // Hindi / Hinglish
  "madarchod", "maderchod", "madarchot", "maadarchod", "behenchod", "bahenchod", "bhenchod", "benchod", "bhanchod", "behnchod",
  "chutiya", "chutiye", "chootiya", "chutiyap", "bhosdi", "bhosad", "bhosda", "bhosri", "gaandu", "gandu", "harami", "haramzad",
  "haramkhor", "randibaaz", "behenkelode", "bhenkelode",
];
/** The hard-R slur anywhere (niggerlover), but not inside "snigger" or "niggardly"; "wanker" but not "swanker". */
const SLUR_INFIX = "(?<!s)n+i+g+g+(?:e+r+|a+(?!r+d))|(?<!s)w+a+n+k+e+r+";

/** Read as real names when split ("Gan Du"), so the split check leaves them alone. */
const SPLIT_SKIP = new Set(["gandu"]);
/** Real words the stretched whole-word list would catch ("assess" reads as a stretched "asses"). */
const ALLOW = new Set(["assess"]);

/** Devanagari spellings, matched on the text itself (nukta and nasal marks folded away). */
const DEVANAGARI = ["मादरचोद", "बहनचोद", "बहेनचोद", "भेनचोद", "चूतिया", "चुतिया", "भोसड़ी", "भोसडी", "गांडू", "गान्डू", "रंडी", "हरामी", "हरामज़ादा", "लौड़ा", "लवड़ा"];

/** Each letter may repeat ("fuuuck"), but a doubled letter must stay doubled, so "Niger" isn't "nigger". */
const stretch = (w: string) => Array.from(w, (c) => `${c}+`).join("");
const EXACT_SRC = EXACT.map(stretch).join("|");
const INFIX_SRC = `${INFIX.map(stretch).join("|")}|${SLUR_INFIX}`;
const EXACT_RE = new RegExp(`^(?:${EXACT_SRC})(?:${COMPOUND_TAIL})?s?$`);
const INFIX_RE = new RegExp(`(?:${INFIX_SRC})`);
/**
 * The split check wants the joined halves to *be* the word, spelled plainly, so "bit cheesy"
 * isn't "bitch" and "china all" isn't a stretched "chinal".
 */
const WHOLE_RE = new RegExp(`^(?:${[...EXACT, ...INFIX].join("|")}|${SLUR_INFIX})$`);
const foldDevanagari = (s: string) => s.normalize("NFC").replace(/[़ँं]/g, "");
const DEVANAGARI_FOLDED = DEVANAGARI.map(foldDevanagari);

const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", $: "s" };
/**
 * Letters that pass for Latin ones: Cyrillic and Greek lookalikes, and the Latin letters NFKD
 * doesn't take apart (dotless ı, ø, ł, ß...), which would otherwise turn into separators.
 */
const HOMOGLYPH: Record<string, string> = {
  а: "a", е: "e", о: "o", р: "p", с: "c", у: "y", х: "x", і: "i", к: "k", ѕ: "s", ԁ: "d", ν: "v", υ: "u", ο: "o", α: "a", ι: "i",
  ı: "i", ɡ: "g", ɑ: "a", ł: "l", ø: "o", đ: "d", ß: "ss", ŀ: "l", ʋ: "v", ɩ: "i",
};
const homoglyphs = (s: string) => s.replace(/[\s\S]/gu, (c) => HOMOGLYPH[c] ?? c);

/**
 * Lowercase Latin skeleton: lookalikes mapped, fullwidth and maths letters folded (NFKD),
 * accents dropped, everything else a separator. Digits and @ $ ! read as letters
 * ("sh1t", "a$$", "b!tch") only inside a word that has a real letter, so "Room 455" stays a
 * room number. With digits: "drop", digits are separators instead, so "cunt1" is "cunt".
 */
export function skeleton(s: string, digits: "leet" | "drop" = "leet"): string {
  const folded = homoglyphs(homoglyphs(s.toLowerCase()).normalize("NFKD").replace(/\p{M}/gu, ""));
  return folded
    .replace(/[\p{L}\p{N}@$!]+/gu, (word) => {
      if (!/\p{L}/u.test(word)) return " ";
      return word
        .replace(/!(?=[\p{L}\p{N}@$])/gu, "i")
        .replace(/[\s\S]/gu, (c) => (digits === "drop" && /\d/.test(c) ? " " : (LEET[c] ?? c)));
    })
    .replace(/[^a-z]+/g, " ")
    .trim();
}

function unfriendlyWords(words: string[]): boolean {
  if (words.some((w) => !ALLOW.has(w) && (EXACT_RE.test(w) || INFIX_RE.test(w)))) return true;

  // Spelled out with separators: "f.u.c.k", "c u n t".
  for (let i = 0; i < words.length; i++) {
    if (words[i].length !== 1) continue;
    let run = "";
    let j = i;
    while (j < words.length && words[j].length === 1) run += words[j++];
    if (run.length >= 3 && (EXACT_RE.test(run) || INFIX_RE.test(run))) return true;
    i = j - 1;
  }
  // Split in two: "fu ck", "bi tch", "ni.gger". The halves together must be the whole word.
  for (let i = 0; i + 1 < words.length; i++) {
    const joined = words[i] + words[i + 1];
    if (!SPLIT_SKIP.has(joined) && WHOLE_RE.test(joined)) return true;
  }
  return false;
}

export function isUnfriendly(s: string): boolean {
  const folded = foldDevanagari(s);
  if (DEVANAGARI_FOLDED.some((w) => folded.includes(w))) return true;
  const split = (t: string) => t.split(" ").filter(Boolean);
  return unfriendlyWords(split(skeleton(s))) || unfriendlyWords(split(skeleton(s, "drop")));
}

// ---------------------------------------------------------------------------
// Fields
// ---------------------------------------------------------------------------

const NAME_CHARS = /^[\p{L}\p{M}\p{N} .'’\-_&!]+$/u;
const LINE_CHARS = /^[\p{L}\p{M}\p{N}\p{P}\p{S} \u200d]*$/u;

function screen(value: string): CardResult<string> | null {
  if (hasContactDetails(value)) return { ok: false, error: "rejected", message: CONTACT_MESSAGE };
  if (isUnfriendly(value)) return { ok: false, error: "rejected", message: FRIENDLY_MESSAGE };
  return null;
}

export function validateName(input: string): CardResult<string> {
  const name = normalize(input);
  if (!name) return { ok: false, error: "invalid", message: "Write a name on the card." };
  if (codePoints(name) > NAME_MAX) return { ok: false, error: "invalid", message: `Keep the name to ${NAME_MAX} characters.` };
  if (!NAME_CHARS.test(name) || MARK_TOWER.test(name) || !/[\p{L}\p{N}]/u.test(name)) {
    return { ok: false, error: "invalid", message: "Names can use letters, numbers, spaces and . ' - _ & !" };
  }
  return screen(name) ?? { ok: true, value: name };
}

export function validateLine(input: string | undefined): CardResult<string> {
  const line = normalize(input ?? "");
  if (codePoints(line) > LINE_MAX) return { ok: false, error: "invalid", message: `Keep the reason for visit to ${LINE_MAX} characters.` };
  if (!LINE_CHARS.test(line) || MARK_TOWER.test(line)) return { ok: false, error: "invalid", message: "The reason for visit has a character the passport can't print." };
  return screen(line) ?? { ok: true, value: line };
}

export function isStickerMood(cat: unknown): cat is StickerMood {
  return typeof cat === "string" && (STICKER_MOODS as readonly string[]).includes(cat);
}

export type ArrivalCard = { name: string; line: string; cat: StickerMood };

/** The whole card: name, reason for visit, passport photo. First problem wins. */
export function validateCard(input: { name: string; line?: string; cat: string }): CardResult<ArrivalCard> {
  if (!isStickerMood(input.cat)) return { ok: false, error: "invalid", message: "Pick one of the cats for your passport photo." };
  const name = validateName(input.name);
  if (!name.ok) return name;
  const line = validateLine(input.line);
  if (!line.ok) return line;
  return { ok: true, value: { name: name.value, line: line.value, cat: input.cat } };
}

// ---------------------------------------------------------------------------
// Visit date
// ---------------------------------------------------------------------------

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;

/** "YYYY-MM-DD" for the UTC calendar day of a moment. */
export const utcDate = (t: Date) => t.toISOString().slice(0, 10);

/** "YYYY-MM-DD" naming a day that exists: "2026-02-30" and "2026-13-01" don't (Date.parse would roll them over). */
export function isCalendarDate(s: unknown): s is string {
  if (typeof s !== "string" || !ISO_DATE.test(s)) return false;
  const t = Date.parse(`${s}T00:00:00Z`);
  return !Number.isNaN(t) && utcDate(new Date(t)) === s;
}

/**
 * The day printed on a new stamp: the visitor's own calendar date when it's believable, so
 * someone in Auckland signing at 9 am sees their today, not the server's yesterday. Every time
 * zone (UTC-12 to UTC+14) is within one day of the UTC date, so anything further off, or not a
 * real date, gets the server's UTC date instead.
 */
export function resolveVisitDate(input: unknown, now = new Date()): string {
  const today = utcDate(now);
  if (!isCalendarDate(input)) return today;
  const gap = Math.abs(Date.parse(`${input}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`));
  return gap <= DAY_MS ? input : today;
}

// ---------------------------------------------------------------------------
// Visit moment (date and time)
// ---------------------------------------------------------------------------

/** "2026-11-17T22:14", optional seconds and milliseconds, then Z or a ±HH:MM offset. */
const ISO_MOMENT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;
/** Real time zones run from UTC-12:00 to UTC+14:00. */
const OFFSET_MIN = -12 * 60;
const OFFSET_MAX = 14 * 60;
/** How far the visitor's clock may be from the server's. */
const CLOCK_SKEW_MS = 15 * 60_000;

/**
 * The date and time printed on a new stamp. `at` is the visitor's local moment with its offset
 * ("2026-11-17T22:14:05+05:30"): when it's a real date and time in a real time zone and names an
 * instant within 15 minutes of the server's clock, the stamp shows their wall clock (d
 * "2026-11-17", tm "22:14"). Otherwise the date comes from resolveVisitDate(date) and there's no
 * time. Only the wall-clock reading is kept, never the offset, so no place can be read back.
 */
export function resolveVisitMoment(at: unknown, date: unknown, now = new Date()): { d: string; tm?: string } {
  const fallback = () => ({ d: resolveVisitDate(date, now) });
  if (typeof at !== "string" || !ISO_MOMENT.test(at)) return fallback();
  const d = at.slice(0, 10);
  const hh = Number(at.slice(11, 13));
  const mm = Number(at.slice(14, 16));
  const ss = at[16] === ":" ? Number(at.slice(17, 19)) : 0;
  if (!isCalendarDate(d) || hh > 23 || mm > 59 || ss > 59) return fallback();

  const zone = at.match(/(Z|[+-]\d{2}:\d{2})$/)?.[1] ?? "Z";
  let offset = 0;
  if (zone !== "Z") {
    const oh = Number(zone.slice(1, 3));
    const om = Number(zone.slice(4, 6));
    if (om > 59) return fallback();
    offset = (zone[0] === "-" ? -1 : 1) * (oh * 60 + om);
    if (offset < OFFSET_MIN || offset > OFFSET_MAX) return fallback();
  }

  // The instant it names: its wall clock read as UTC, minus the offset.
  const instant = Date.UTC(Number(d.slice(0, 4)), Number(d.slice(5, 7)) - 1, Number(d.slice(8, 10)), hh, mm, ss) - offset * 60_000;
  if (Math.abs(instant - now.getTime()) > CLOCK_SKEW_MS) return fallback();
  return { d, tm: at.slice(11, 16) };
}
