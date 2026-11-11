"use client";

import Link from "next/link";
import { useRef, type ComponentProps } from "react";
import { useTransitionGo } from "./TransitionProvider";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Completion shown on the slap sticker, e.g. "builds agents". */
  transitionLabel?: string;
};

/** A Next.js Link that runs the slap + peel transition for client-side navigations. */
export function TransitionLink({ href, transitionLabel, onClick, onNavigate, ...props }: Props) {
  const go = useTransitionGo();
  const origin = useRef<{ x: number; y: number } | undefined>(undefined);

  return (
    <Link
      href={href}
      onClick={(e) => {
        // Link calls onClick before onNavigate; remember where the slap starts.
        origin.current = e.clientX || e.clientY ? { x: e.clientX, y: e.clientY } : undefined;
        onClick?.(e);
      }}
      onNavigate={(e) => {
        onNavigate?.(e);
        e.preventDefault();
        go(href, { label: transitionLabel, origin: origin.current });
      }}
      {...props}
    />
  );
}
