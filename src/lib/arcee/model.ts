import type { LanguageModel } from "ai";

/**
 * The model behind Arcee (docs/spec.md §8.2): Groq's gpt-oss-20b by default,
 * overridable with ARCEE_MODEL. Returns null when no key is configured, so the
 * chat can say it's offline. ARCEE_MOCK=1 swaps in a local stand-in for
 * development and tests without a key.
 */
export async function getArceeModel(): Promise<LanguageModel | null> {
  if (process.env.ARCEE_MOCK === "1") {
    const { createMockArcee } = await import("./mock-model");
    return createMockArcee();
  }
  if (!process.env.GROQ_API_KEY) return null;
  const { groq } = await import("@ai-sdk/groq");
  return groq(process.env.ARCEE_MODEL || "openai/gpt-oss-20b");
}
