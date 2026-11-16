import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { checkInput, MAX_TURNS } from "@/lib/arcee/guard";
import { getArceeModel } from "@/lib/arcee/model";
import { buildInstructions } from "@/lib/arcee/prompt";
import { limitChat, visitorKey } from "@/lib/arcee/ratelimit";
import { retrieve } from "@/lib/arcee/retrieve";
import type { StickerMood } from "@/lib/arcee/stickers";
import { arceeTools } from "@/lib/arcee/tools";
import { SITE } from "@/content/site";

/**
 * Arcee's chat endpoint (docs/spec.md §8.1): validate → guard → rate limit →
 * retrieve → stream from the model with tools. Guard, limit and offline
 * replies are streamed like normal replies so the chat UI treats them the same.
 */

const Body = z.object({
  messages: z
    .array(z.object({ id: z.string(), role: z.enum(["user", "assistant", "system"]), parts: z.array(z.unknown()) }).passthrough())
    .min(1)
    .max(60),
  shift: z.enum(["day", "night"]).optional(),
});

function textOf(message: UIMessage | undefined): string {
  if (!message) return "";
  return message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
}

/** A rough token count (about 4 characters per token, rounded up generously). */
const tokens = (text: string) => Math.ceil(text.length / 3.6);
/** Prompt + documents + conversation; the reply (maxOutputTokens) and tool schemas come on top. */
const INPUT_BUDGET = 5500;

function fitToBudget(instructions: string, messages: UIMessage[]): UIMessage[] {
  const cost = (m: UIMessage) => tokens(JSON.stringify(m.parts));
  let total = tokens(instructions) + messages.reduce((n, m) => n + cost(m), 0);
  let start = 0;
  // Always keep the latest message.
  while (total > INPUT_BUDGET && start < messages.length - 1) {
    total -= cost(messages[start]);
    start += 1;
  }
  return messages.slice(start);
}

function cannedReply(text: string, mood?: StickerMood) {
  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute({ writer }) {
        writer.write({ type: "start" });
        writer.write({ type: "text-start", id: "canned" });
        writer.write({ type: "text-delta", id: "canned", delta: text });
        writer.write({ type: "text-end", id: "canned" });
        if (mood) writer.write({ type: "data-sticker", data: { mood } });
        writer.write({ type: "finish" });
      },
    }),
  });
}

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "bad-request" }, { status: 400 });

  // Never trust client-sent system messages; keep the recent turns only.
  const messages = (parsed.data.messages as unknown as UIMessage[]).filter((m) => m.role !== "system").slice(-MAX_TURNS);
  const users = messages.filter((m) => m.role === "user");
  const question = textOf(users[users.length - 1]);

  const verdict = checkInput(question);
  if (!verdict.ok) return cannedReply(verdict.reply, verdict.reason === "injection" ? "sus" : undefined);

  const limit = await limitChat(visitorKey(req.headers));
  if (!limit.ok) {
    return cannedReply("That's a lot of questions. Give me a few minutes, or just email Itesh directly.", "sobbing");
  }

  const model = await getArceeModel();
  if (!model) {
    return cannedReply(`I'm not plugged in yet, so no answers for now. Email Itesh at ${SITE.email} and he'll get back to you.`, "crying");
  }

  // The latest question gets most slots; the two before it keep follow-ups ("can this increase?") in context.
  const context = retrieve(
    question,
    users
      .slice(-3, -1)
      .map((m) => textOf(m))
      .join(" "),
  );

  // Stay well under Groq's 8,000-token limit per request: drop the oldest turns until the prompt,
  // the documents and the conversation fit the budget, leaving room for the reply.
  const instructions = buildInstructions(context, parsed.data.shift ?? "day");
  const fitted = fitToBudget(instructions, messages);

  const result = streamText({
    model,
    instructions,
    messages: await convertToModelMessages(fitted),
    tools: arceeTools,
    stopWhen: isStepCount(3),
    maxOutputTokens: 600,
    temperature: 0.6,
    abortSignal: req.signal,
    providerOptions: { groq: { reasoningFormat: "hidden", reasoningEffort: "low" } },
  });

  return createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) });
}
