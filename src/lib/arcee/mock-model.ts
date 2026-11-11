import { simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";

/**
 * A deterministic stand-in for Arcee's model (ARCEE_MOCK=1), for local
 * development and tests without a Groq key. It answers from the first
 * retrieved document and exercises the navigate and sticker tools.
 */

type Part = { type: string; text?: string };
type Msg = { role: string; content: string | Part[] };

const usage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: 20, text: 20, reasoning: undefined },
};

const PAGES: Array<[RegExp, string]> = [
  [/\barcee\b/i, "/work/arcee"],
  [/patent/i, "/work/patentiq"],
  [/diachat|companion/i, "/work/diachat"],
  [/dialabs|lab\b/i, "/dialabs"],
  [/contact|email|hire/i, "/contact"],
  [/about|experience/i, "/about"],
  [/work|projects?/i, "/work"],
];

function textOf(m: Msg | undefined): string {
  if (!m) return "";
  if (typeof m.content === "string") return m.content;
  return m.content.map((p) => p.text ?? "").join(" ");
}

export function createMockArcee() {
  let callId = 0;
  return new MockLanguageModelV4({
    doStream: async ({ prompt }) => {
      const messages = prompt as unknown as Msg[];
      const last = messages[messages.length - 1];
      const system = textOf(messages.find((m) => m.role === "system"));
      const chunks: unknown[] = [];
      const say = (id: string, text: string) => chunks.push({ type: "text-start", id }, { type: "text-delta", id, delta: text }, { type: "text-end", id });

      if (last?.role === "tool") {
        say("t2", "There you go.");
        chunks.push({ type: "finish", finishReason: { unified: "stop", raw: undefined }, usage });
      } else {
        const question = textOf([...messages].reverse().find((m) => m.role === "user"));
        const docs = [...system.matchAll(/<doc id="([^"]+)" page="([^"]+)" title="([^"]+)">\n([^<]+)/g)];
        const best = docs.find((d) => d[1] !== "about-itesh") ?? docs[0];
        const wantsNav = /\b(show|open|take me|go to)\b/i.test(question);
        const target = PAGES.find(([re]) => re.test(question))?.[1];

        const email = question.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)?.[0];
        if (email) {
          say("t1", "Here's your draft. Press Send when it looks right.");
          chunks.push({
            type: "tool-call",
            toolCallId: `msg-${++callId}`,
            toolName: "draftMessage",
            input: JSON.stringify({ name: "A visitor", contact: email, message: question.replace(email, "").trim() || "Hi Itesh!" }),
          });
        } else if (/leave (a )?message|contact him|reach him/i.test(question)) {
          say("t1", "Sure. What's your name, how can he reach you, and what's the message?");
          chunks.push({ type: "tool-call", toolCallId: `st-${++callId}`, toolName: "sticker", input: JSON.stringify({ mood: "love" }) });
        } else if (wantsNav && target) {
          say("t1", "On it, opening that page for you.");
          chunks.push({ type: "tool-call", toolCallId: `nav-${++callId}`, toolName: "navigate", input: JSON.stringify({ path: target }) });
        } else {
          const sentence = best ? best[4].split(/(?<=\.)\s/)[0] : "Itesh hasn't shared that yet.";
          say("t1", `(stand-in model) ${sentence}`);
          chunks.push({ type: "tool-call", toolCallId: `st-${++callId}`, toolName: "sticker", input: JSON.stringify({ mood: "happy" }) });
        }
        chunks.push({ type: "finish", finishReason: { unified: "tool-calls", raw: undefined }, usage });
      }

      return { stream: simulateReadableStream({ chunks: chunks as never[], chunkDelayInMs: 15 }) };
    },
  });
}
