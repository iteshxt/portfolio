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
    description:
      "Prepare a message for Itesh. Only call it once the visitor has told you their name, how to reach them and their message. The visitor checks the card and presses Send.",
    // Lenient on purpose: a strict schema makes Groq reject the whole reply when the model jumps the
    // gun. Missing or invented details come back as `missing`, and the model asks for them instead.
    inputSchema: z.object({
      name: z.string().max(80).optional().describe("The visitor's name, as they gave it"),
      contact: z.string().max(120).optional().describe("Email or another way to reach them, exactly as the visitor gave it"),
      message: z.string().max(1200).optional().describe("The message, in the visitor's words"),
    }),
    execute: async ({ name = "", contact = "", message = "" }) => {
      const missing = [
        (!name.trim() || PLACEHOLDER_NAME.test(name.trim())) && "their name",
        (contact.trim().length < 3 || PLACEHOLDER_CONTACT.test(contact.trim())) && "how to reach them",
        !message.trim() && "the message",
      ].filter(Boolean) as string[];
      if (missing.length) return { missing, note: `Don't draft yet. Ask the visitor for ${missing.join(" and ")}.` };
      return { name: name.trim(), contact: contact.trim(), message: message.trim() };
    },
  }),
};
