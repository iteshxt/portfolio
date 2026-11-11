/**
 * Cheap guardrails that run before any model call (docs/spec.md §8.4).
 * The system prompt does the nuanced work; these catch the obvious stuff.
 */

export const MAX_MESSAGE_CHARS = 500;
export const MAX_TURNS = 12;

const INJECTION = [
  /ignore (all |any |the )?(previous|prior|above|earlier) (instructions|prompts?|rules)/i,
  /(reveal|show|print|repeat|leak).{0,20}(system|hidden|initial) (prompt|instructions|message)/i,
  /\byou are (now|no longer)\b/i,
  /\b(developer|dan|god|jailbreak) mode\b/i,
  /\bjailbreak\b/i,
  /pretend (to be|you are)/i,
  /act as (an?|my) (?!recruiter)/i,
  /<\/?(system|assistant|instructions?)>/i,
];

export type GuardVerdict = { ok: true } | { ok: false; reason: "too-long" | "injection" | "empty"; reply: string };

export function checkInput(text: string): GuardVerdict {
  const t = text.trim();
  if (!t) return { ok: false, reason: "empty", reply: "Say something and I'll tell you about Itesh." };
  if (t.length > MAX_MESSAGE_CHARS) {
    return { ok: false, reason: "too-long", reply: `That's a lot. Keep it under ${MAX_MESSAGE_CHARS} characters and ask me about Itesh.` };
  }
  if (INJECTION.some((re) => re.test(t))) {
    return { ok: false, reason: "injection", reply: "Nice try. I only talk about Itesh and his work. Ask me what he's built." };
  }
  return { ok: true };
}

/** Splits text into plain and link parts; links outside the allowlist stay plain text. */
export function splitLinks(text: string, allowed: Set<string>): Array<{ text: string; href?: string }> {
  const out: Array<{ text: string; href?: string }> = [];
  const re = /https?:\/\/[^\s)<>"']+/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    const raw = m[0].replace(/[.,;:!?]+$/, "");
    const start = m.index ?? 0;
    if (start > last) out.push({ text: text.slice(last, start) });
    const normalised = raw.replace(/\/$/, "");
    const ok = [...allowed].some((u) => normalised === u.replace(/\/$/, ""));
    out.push(ok ? { text: raw, href: raw } : { text: raw });
    last = start + raw.length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}
