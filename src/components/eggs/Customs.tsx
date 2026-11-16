"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { OpenArceeButton } from "@/components/arcee/OpenArceeButton";
import { ArrowRight, Spark } from "@/components/icons";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { markEgg } from "@/lib/eggs";
import { play } from "@/lib/sound";

const VALID = /^[a-z0-9]{4,8}$/;

/**
 * The phone side of the barcode egg (docs/design.md §2.17): a customs
 * declaration for the visitor, who has just been "shipped". It tells the scan
 * API, then a CLEARED stamp thumps on; the desktop's manifest prints them as
 * item 23 at the same time.
 */
export function Customs({ code }: { code: string }) {
  const valid = VALID.test(code);
  const [state, setState] = useState<"checking" | "cleared" | "offline">(valid ? "checking" : "offline");

  useEffect(() => {
    if (!valid) return;
    markEgg("barcode");
    let cancelled = false;
    fetch("/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) })
      .then((r) => {
        if (cancelled) return;
        play("found");
        setState(r.ok ? "cleared" : "offline");
      })
      .catch(() => !cancelled && setState("offline"));
    return () => {
      cancelled = true;
    };
  }, [code, valid]);

  const rows: [string, string][] = [
    ["Item", "1 curious human"],
    ["Shipped with", "22 other things"],
    ["Declared value", "priceless"],
    ["Handling", "fragile · keep away from bugs"],
    ["Parcel", `no. 23 of 22 · ${valid ? code.toUpperCase() : "UNKNOWN"}`],
  ];

  return (
    <main className="faded-mat px-gutter flex flex-1 flex-col items-center pt-28 pb-36">
      <p data-animate="rise" className="font-hand text-[clamp(24px,5vw,32px)] text-accent-text">
        beep. you scanned the manifest.
      </p>
      <div className="customs-form relative mt-6 w-full max-w-[520px] overflow-hidden rounded-[10px] bg-surface font-mono text-[14px]">
        <div className="flex items-center justify-between bg-ink px-5 py-3 text-[12px] tracking-[0.2em] text-paper uppercase">
          <span>Customs declaration</span>
          <span>iteshxt.me</span>
        </div>
        <dl className="divide-y divide-dashed divide-line px-5">
          {rows.map(([k, v], i) => (
            <div key={k} data-animate="row" style={{ "--d": `${120 + i * 90}ms` } as CSSProperties} className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-[11px] tracking-[0.18em] text-fg-muted uppercase">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="border-t-2 border-dashed border-line px-5 py-4 text-[12px] leading-relaxed text-fg-muted">
          {state === "offline"
            ? "The post office is closed right now, so the other screen won't notice. You still count."
            : "Look at the screen you scanned from: you've just been added to the manifest."}
        </p>
        {state === "cleared" && (
          <span aria-hidden="true" className="customs-stamp absolute top-[34%] right-[8%] rounded-[8px] border-[4px] px-3 py-1 text-[26px] font-bold tracking-[0.18em]">
            CLEARED
          </span>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {state === "cleared" ? "Cleared by customs." : ""}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <TransitionLink href="/contact" transitionLabel="Contact" className="btn btn-ink">
          Say hi
          <ArrowRight />
        </TransitionLink>
        <OpenArceeButton seed="I just scanned the manifest. What should I look at?" className="btn btn-lime">
          <Spark />
          Ask Arcee
        </OpenArceeButton>
        <TransitionLink href="/work" transitionLabel="Work" className="btn btn-paper">
          See the rest of the shipment
        </TransitionLink>
      </div>
    </main>
  );
}
