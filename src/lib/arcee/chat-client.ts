"use client";

import { Chat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { play } from "@/lib/sound";
import { useUI } from "@/store/ui";

/**
 * One conversation with Arcee shared by the floating panel and the /arcee page,
 * so a chat started in one continues in the other.
 */
export const arceeChat = new Chat({
  transport: new DefaultChatTransport({
    api: "/api/arcee",
    prepareSendMessagesRequest: ({ messages }) => ({ body: { messages, shift: useUI.getState().shift } }),
  }),
  onFinish: () => play("select"),
});
