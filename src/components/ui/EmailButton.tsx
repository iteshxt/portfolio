"use client";

import { useState } from "react";
import { Check, Copy, Mail } from "@/components/icons";
import { cn } from "@/lib/cn";

/** Big email pill: the address opens the mail app, the side button copies it. */
export function EmailButton({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    // w-fit: inside a flex column it would otherwise stretch and push the copy button to the far edge.
    <div className={cn("inline-flex w-fit max-w-full items-stretch overflow-hidden rounded-full bg-lime text-[#2B3600]", className)}>
      <a href={`mailto:${email}`} className="flex min-w-0 items-center gap-3 py-4 pr-4 pl-6 text-[clamp(17px,2vw,24px)] font-medium hover:bg-black/5">
        <Mail className="shrink-0" />
        <span className="truncate">{email}</span>
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email copied" : "Copy email address"}
        className="flex items-center gap-2 border-l-2 border-[#2B3600]/15 pr-5 pl-4 text-[20px] hover:bg-black/5"
      >
        {copied ? <Check /> : <Copy />}
        {copied && <span className="text-[14px] font-medium">Copied</span>}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
