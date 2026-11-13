"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowRight } from "@/components/icons";
import { SITE } from "@/content/site";
import { cn } from "@/lib/cn";
import { play } from "@/lib/sound";

type State = "idle" | "sending" | "sent" | "error";

const ERRORS: Record<string, string> = {
  "rate-limited": "That's enough postcards for today.",
  invalid: "Something on the card looks off. Check the lines and try again.",
  "not-configured": "The postbox is closed right now.",
};

/**
 * The contact page's postcard (docs/design.md §2.14): write on the left, address
 * it on the right, press Send. It posts to the leave-a-message endpoint; a red
 * SENT postmark thumps on, the card slides off into the post, and a note says
 * it arrived. Nothing is sent until the visitor presses Send.
 */
export function Postcard() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {
      name: String(form.get("name") ?? ""),
      contact: String(form.get("contact") ?? ""),
      message: String(form.get("message") ?? ""),
      website: String(form.get("website") ?? ""),
      via: "postcard",
    };
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/arcee/message", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "send-failed");
      play("select");
      setSentTo(body.contact);
      setState("sent");
    } catch (err) {
      setError(ERRORS[(err as Error).message] ?? "It didn't go through.");
      setState("error");
    }
  }

  return (
    <div className="postcard-stage relative">
      {state === "sent" && (
        <div className="postcard-thanks absolute inset-0 flex flex-col items-start justify-center gap-4 rounded-[22px] border-[3px] border-dashed border-line p-[clamp(22px,3vw,44px)]">
          <p className="font-serif text-[clamp(20px,1.8vw,26px)] text-fg-muted italic">Delivered.</p>
          <p className="max-w-[24ch] text-[clamp(30px,3.4vw,48px)] leading-[1.05] font-semibold tracking-[-0.04em] [font-variation-settings:'wdth'_80]">
            Got it. I&rsquo;ll write back to {sentTo}.
          </p>
          <button
            type="button"
            onClick={() => {
              formRef.current?.reset();
              setState("idle");
            }}
            className="btn btn-paper"
          >
            Write another
          </button>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={submit}
        data-state={state}
        aria-label="Write a postcard to Itesh"
        className="contact-card relative grid overflow-hidden rounded-[22px] border-[5px] border-[var(--die)] bg-surface md:grid-cols-[1.15fr_1fr]"
      >
        {/* Left: the message, on ruled lines. */}
        <label className="relative flex flex-col p-[clamp(18px,2.6vw,36px)] md:border-r-2 md:border-dashed md:border-line">
          <span className="font-mono text-[11px] tracking-[0.2em] text-fg-muted uppercase">Your message</span>
          <textarea
            name="message"
            required
            maxLength={1200}
            rows={7}
            placeholder="Hi Itesh, I'm building…"
            className="postcard-lines mt-2 min-h-[220px] w-full flex-1 resize-none bg-transparent font-hand text-[clamp(22px,2vw,27px)] leading-[36px] outline-none placeholder:text-fg-muted/60"
          />
        </label>

        {/* Right: stamp, postmark and the address. */}
        <div className="relative flex flex-col gap-5 p-[clamp(18px,2.6vw,36px)]">
          <div className="flex items-start justify-between gap-4">
            <svg viewBox="0 0 120 70" aria-hidden="true" className="postmark w-[clamp(96px,9vw,128px)] text-fg-muted/60">
              <circle cx="35" cy="35" r="29" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="35" cy="35" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="35" y="33" textAnchor="middle" className="font-mono" fontSize="8" fill="currentColor">ITESH</text>
              <text x="35" y="43" textAnchor="middle" className="font-mono" fontSize="7" fill="currentColor">AIRMAIL</text>
              <path d="M66 22c8-4 14 4 22 0s14 4 22 0M66 35c8-4 14 4 22 0s14 4 22 0M66 48c8-4 14 4 22 0s14 4 22 0" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="stamp postcard-stamp shrink-0 bg-violet text-white" aria-hidden="true">
              <span className="flex flex-col items-center justify-center gap-0.5 px-3 py-2">
                <span className="font-mono text-[9px] tracking-widest opacity-80">NO. 01</span>
                <span className="font-serif text-[28px] leading-none italic">itesh</span>
                <span className="font-mono text-[9px] tracking-widest opacity-80">FIRST CLASS</span>
              </span>
            </span>
          </div>
          <div className="mt-auto flex flex-col gap-4">
            <p className="postcard-field font-hand text-[clamp(22px,2vw,26px)]">
              <span className="mr-2 font-mono text-[11px] tracking-[0.2em] text-fg-muted uppercase">To</span>
              Itesh
            </p>
            <label className="postcard-field flex items-baseline gap-2">
              <span className="font-mono text-[11px] tracking-[0.2em] text-fg-muted uppercase">From</span>
              <input name="name" required maxLength={80} autoComplete="name" placeholder="your name" className="w-full min-w-0 bg-transparent font-hand text-[clamp(22px,2vw,26px)] outline-none placeholder:text-fg-muted/60" />
            </label>
            <label className="postcard-field flex items-baseline gap-2">
              <span className="font-mono text-[11px] tracking-[0.2em] whitespace-nowrap text-fg-muted uppercase">Reply to</span>
              <input name="contact" required minLength={3} maxLength={120} autoComplete="email" placeholder="email, or where to find you" className="w-full min-w-0 bg-transparent font-hand text-[clamp(22px,2vw,26px)] outline-none placeholder:text-fg-muted/60" />
            </label>
            {/* Honeypot: hidden from people, irresistible to bots. */}
            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <button type="submit" disabled={state === "sending"} className="btn btn-ink">
              {state === "sending" ? "Posting…" : "Send it"}
              <ArrowRight />
            </button>
            <span aria-live="polite" className={cn("text-[14px]", state === "error" ? "text-[#c23a1f] night:text-[#ff8f7a]" : "text-fg-muted")}>
              {state === "error" ? (
                <>
                  {error} Email works:{" "}
                  <a href={`mailto:${SITE.email}`} className="underline underline-offset-4">
                    {SITE.email}
                  </a>
                </>
              ) : (
                "Lands straight in my inbox."
              )}
            </span>
          </div>
        </div>

        {/* The postmark that thumps on when it's sent. */}
        <span aria-hidden="true" className="postcard-sent pointer-events-none absolute top-[18%] right-[10%] grid size-[clamp(110px,11vw,150px)] place-items-center rounded-full border-[4px] border-[#c23a1f] text-center font-mono text-[13px] leading-tight font-semibold tracking-widest text-[#c23a1f]">
          <span>
            SENT
            <br />
            <span className="text-[10px]">ITESHXT.ME</span>
          </span>
        </span>
      </form>
    </div>
  );
}
