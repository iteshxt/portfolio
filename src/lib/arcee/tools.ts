import { tool } from "ai";
import { z } from "zod";
import { NAVIGABLE } from "./retrieve";
import { STICKER_MOODS } from "./stickers";

/**
 * Arcee's tools (docs/spec.md §8.5). They only return data; the chat panel
 * acts on it (navigates, shows the sticker, shows the draft to confirm).
 */
/** Values a model invents when the visitor hasn't said: never draft with these. */
const PLACEHOLDER_NAME = /^(\?+|-+|n\/?a|unknown|anonymous|a visitor|visitor|name|your name)$/i;
const PLACEHOLDER_CONTACT = /(^(\?+|-+|n\/?a|unknown|email|e-mail|contact|your email)$)|@example\.(com|org|net)$|@test\.|^test@/i;

export const arceeTools = {
  navigate: tool({
    description: "Open a page of Itesh's site for the visitor. Use when they ask to see, open or go to something.",
    inputSchema: z.object({
      path: z.enum(Object.keys(NAVIGABLE) as [string, ...string[]]).describe("The page to open"),
    }),
    execute: async ({ path }) => ({ path, label: NAVIGABLE[path] }),
  }),
  sticker: tool({
    description: "Attach one cat sticker matching the mood of your reply. Optional; at most once per reply.",
    inputSchema: z.object({ mood: z.enum(STICKER_MOODS) }),
    execute: async ({ mood }) => ({ mood }),
  }),
  draftMessage: tool({
    description: "Prepare a message for Itesh once you know the visitor's name, how to reach them and their message. The visitor confirms and sends it.",
    inputSchema: z.object({
      name: z
        .string()
        .min(1)
        .max(80)
        .refine((v) => !PLACEHOLDER_NAME.test(v.trim()), "Ask the visitor for their real name."),
      contact: z
        .string()
        .min(3)
        .max(120)
        .refine((v) => !PLACEHOLDER_CONTACT.test(v.trim()), "Ask the visitor how to reach them; don't invent it.")
        .describe("Email or another way to reach them, exactly as the visitor gave it"),
      message: z.string().min(1).max(1200),
    }),
    execute: async (draft) => draft,
  }),
};
