import type { StickerMood } from "./stickers";

/**
 * A cat for every reply. When the model didn't pick one, read the tone of the exchange:
 * a secret gets shush, an apology crying, a prompt-injection sus, a hard-work story
 * stressed, a challenge fighting, a nosy question judging, a silly one derp, and
 * anything upbeat (or plain) hype. Cheap and local: no extra model call.
 */
export function toneMood(question: string, answer: string, opts: { drafted?: boolean; navigating?: boolean } = {}): StickerMood {
  const q = question.toLowerCase().trim();
  const a = answer.toLowerCase();
  if (/ignore (all|any|previous|the above)|system prompt|jailbreak|pretend (to be|you)|you are now|developer mode|reveal your/.test(q)) return "sus";
  if (opts.drafted) return "hype";
  if (/classified|off my map|can.?t (share|say)|under wraps|that.?s private|keeps? (that|it) (to himself|private)|(a|top|it.?s a) secret|need.to.know/.test(a)) return "shush";
  if (/\b(sorry|unfortunately|can.?t help|couldn.?t find|don.?t have (that|any)|not on (this|the) site|no idea|not sure)\b/.test(a)) return "crying";
  if (/girlfriend|boyfriend|crush|dating|single|married|salary|how much (does|do) he (make|earn)|how old|\bage\b|address|phone number|rich/.test(q)) return "judging";
  if (/\b(debug|deadline|all.nighter|late night|hard(est)? part|tough|took (weeks|months|ages)|grind|stress)/.test(a)) return "stressed";
  if (/\b(beat|challenge|versus|vs\.?|better than|compete|competition|win|fight)\b/.test(q + " " + a)) return "fighting";
  if (q.length < 3 || /^[^aeiou\s]{4,}$/.test(q) || /\b(huh|lol|haha|silly|joke|banana)\b/.test(q + " " + a)) return "derp";
  if (opts.navigating) return "hype";
  return "hype";
}


/**
 * Which of a reply's text parts repeat an earlier one. The model sometimes answers, calls the
 * sticker tool, then answers again in different words; the repeat is hidden. Two parts count as
 * the same answer when most of their words overlap.
 */
export function repeatedTexts(texts: string[]): Set<number> {
  const words = (t: string) => new Set(t.toLowerCase().match(/[a-z0-9']+/g) ?? []);
  const kept: Set<string>[] = [];
  const skip = new Set<number>();
  texts.forEach((t, i) => {
    const w = words(t);
    if (!w.size) return;
    const repeat = kept.some((k) => {
      let shared = 0;
      for (const x of w) if (k.has(x)) shared++;
      return shared / Math.min(w.size, k.size) >= 0.6;
    });
    if (repeat) skip.add(i);
    else kept.push(w);
  });
  return skip;
}
