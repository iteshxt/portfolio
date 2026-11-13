"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { ArrowUpRight, Check, Copy, Mail, Spark } from "@/components/icons";
import { SITE } from "@/content/site";
import { cn } from "@/lib/cn";
import { useFlick } from "@/lib/flick";
import { useUI } from "@/store/ui";

type StampProps = { tone: string; tilt: number; label: string; name: string; note: string; icon: ReactNode; i: number };

function StampFace({ tone, label, name, note, icon }: Omit<StampProps, "tilt" | "i">) {
  return (
    <span className={cn("stamp flex w-full", tone)}>
      <span className="flex w-full flex-col justify-between gap-5 p-4">
        <span className="flex items-center justify-between font-mono text-[10px] font-semibold tracking-widest uppercase">
          {label}
          {icon}
        </span>
        <span>
          <span className="block text-[clamp(24px,2.2vw,32px)] leading-none font-semibold tracking-[-0.04em] [font-variation-settings:'wdth'_80]">{name}</span>
          <span className="mt-1.5 block text-[13px] leading-snug">{note}</span>
        </span>
      </span>
    </span>
  );
}

function LinkStamp({ href, ...p }: StampProps & { href: string }) {
  const ref = useFlick<HTMLAnchorElement>();
  return (
    <a ref={ref} href={href} target="_blank" rel="noreferrer" data-cursor={p.name} data-animate="slap" style={{ "--d": `${p.i * 80}ms`, rotate: `${p.tilt}deg` } as CSSProperties} className="stamp-wrap flex">
      <StampFace {...p} />
    </a>
  );
}

/**
 * The other ways in, as perforated postage stamps (docs/design.md §2.14): email
 * (tap to copy), LinkedIn, GitHub, X, and Arcee (opens the chat). They flick
 * when the cursor knocks them.
 */
export function Stamps() {
  const [copied, setCopied] = useState(false);
  const mailRef = useFlick<HTMLButtonElement>();
  const arceeRef = useFlick<HTMLButtonElement>();

  async function copy() {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  }

  return (
    <ul className="grid grid-cols-2 gap-4">
      <li className="col-span-2">
        <button
          ref={mailRef}
          type="button"
          onClick={copy}
          data-cursor={copied ? "Copied" : "Copy"}
          data-animate="slap"
          style={{ rotate: "-1.5deg" } as CSSProperties}
          className="stamp-wrap flex w-full text-left"
        >
          <StampFace tone="bg-lime text-[#2B3600]" label="Airmail" name={SITE.email} note={copied ? "Copied. Paste it anywhere." : "Tap to copy the address."} icon={copied ? <Check className="text-[14px]" /> : <Copy className="text-[14px]" />} />
        </button>
      </li>
      <li>
        <LinkStamp i={1} href={SITE.socials.linkedin} tone="bg-lavender text-violet-ink" tilt={2} label="Formal" name="LinkedIn" note="The formal version." icon={<ArrowUpRight className="text-[14px]" />} />
      </li>
      <li>
        <LinkStamp i={2} href={SITE.socials.github} tone="bg-sunflower text-[#4A3A00]" tilt={-2.5} label="Receipts" name="GitHub" note="Read the code, not the claims." icon={<ArrowUpRight className="text-[14px]" />} />
      </li>
      <li>
        <LinkStamp i={3} href={SITE.socials.x} tone="bg-tomato text-[#2A0700]" tilt={-1} label="Thoughts" name="X" note="Occasional thoughts." icon={<ArrowUpRight className="text-[14px]" />} />
      </li>
      <li>
        <button
          ref={arceeRef}
          type="button"
          onClick={() => useUI.getState().openArcee("I want to leave a message for Itesh")}
          data-cursor="Ask"
          data-animate="slap"
          style={{ "--d": "320ms", rotate: "2deg" } as CSSProperties}
          className="stamp-wrap flex w-full text-left"
        >
          <StampFace tone="bg-violet text-white" label="Express" name="Arcee" note="Tell the chatbot; it passes it on." icon={<Spark className="text-[14px]" />} />
        </button>
      </li>
      <li className="col-span-2 sr-only">
        <a href={`mailto:${SITE.email}`}>
          <Mail /> Email {SITE.email}
        </a>
      </li>
    </ul>
  );
}
