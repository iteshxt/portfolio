"use client";

import { useState } from "react";
import { Check, Mail } from "@/components/icons";
import { play } from "@/lib/sound";

export type Draft = { name: string; contact: string; message: string };

const ERRORS: Record<string, string> = {
  "not-configured": "Message sending isn't switched on yet. Email mail.iteshxt@gmail.com instead.",
  "rate-limited": "That's enough messages for today. Email works too: mail.iteshxt@gmail.com.",
  invalid: "Something in the message looks off. Try rephrasing it.",
};

/** Arcee's message draft: nothing is sent until the visitor presses Send. */
export function DraftCard({ draft }: { draft: Draft }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState("");

  async function send() {
    setState("sending");
    try {
      const res = await fetch("/api/arcee/message", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...draft, website: honeypot }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && body.ok) {
        setState("sent");
        play("found");
      } else {
        setState("error");
        setError(ERRORS[body.error ?? ""] ?? "Couldn't send that. Email mail.iteshxt@gmail.com instead.");
      }
    } catch {
      setState("error");
      setError("Couldn't reach the server. Email mail.iteshxt@gmail.com instead.");
    }
  }

  return (
    <div className="mt-2 rounded-2xl border border-line bg-surface p-3 text-[14px]">
      <p className="mb-2 flex items-center gap-1.5 font-semibold">
        <Mail /> Message for Itesh
      </p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt className="text-fg-muted">From</dt>
        <dd>{draft.name}</dd>
        <dt className="text-fg-muted">Reply to</dt>
        <dd className="break-all">{draft.contact}</dd>
      </dl>
      <p className="mt-2 whitespace-pre-wrap rounded-xl bg-bg p-2.5">{draft.message}</p>
      {/* Honeypot: hidden from people, tempting for bots. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px] size-px opacity-0"
      />
      {state === "sent" ? (
        <p className="mt-3 flex items-center gap-1.5 font-medium text-accent-text">
          <Check /> Sent. Itesh will get back to you.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={send}
            disabled={state === "sending"}
            className="min-h-10 rounded-full bg-violet px-4 font-medium text-white disabled:opacity-50"
          >
            {state === "sending" ? "Sending…" : "Send it"}
          </button>
          <span className="text-[13px] text-fg-muted">Not right? Tell Arcee what to change.</span>
        </div>
      )}
      {state === "error" && <p className="mt-2 text-[13px] text-tomato">{error}</p>}
    </div>
  );
}
