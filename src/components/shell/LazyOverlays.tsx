"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { foundEgg } from "@/lib/eggs";
import { konamiStep } from "@/lib/konami";
import { isTypingTarget } from "@/lib/motion";
import { useUI } from "@/store/ui";

// The chat (AI SDK + content corpus), the terminal and the scuba cat are only
// downloaded the first time they're used (docs/spec.md §12).
const ArceePanel = dynamic(() => import("@/components/arcee/ArceePanel").then((m) => m.ArceePanel), { ssr: false });
const Terminal = dynamic(() => import("@/components/eggs/Terminal").then((m) => m.Terminal), { ssr: false });
const ScubaCat = dynamic(() => import("@/components/eggs/ScubaCat").then((m) => m.ScubaCat), { ssr: false });

/** Warm the chat chunk when a visitor shows intent (nav bar opened). */
export function preloadArcee() {
  void import("@/components/arcee/ArceePanel");
}

/**
 * Always-loaded launcher for the heavy overlays: owns the global shortcuts
 * (` / ~ for the terminal, the Konami code for the scuba cat) and mounts each
 * overlay on first use.
 */
export function LazyOverlays({ now }: { now: { repo: string; message: string } | null }) {
  const arceeMounted = useUI((s) => s.arceeMounted);
  const terminalMounted = useUI((s) => s.terminalMounted);
  const [scubaRun, setScubaRun] = useState(0);
  const konami = useRef(0);
  const scubaDone = useCallback(() => setScubaRun(0), []);

  useEffect(() => {
    const launchScuba = () => {
      setScubaRun((n) => n + 1);
      foundEgg("scuba", "Easter egg found: scuba cat", "It's also a real Linux boot animation: github.com/iteshxt/scuba-cat");
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "`" || e.key === "~") && !isTypingTarget(e.target)) {
        e.preventDefault();
        const ui = useUI.getState();
        ui.setTerminalOpen(!ui.terminalOpen);
        return;
      }
      konami.current = konamiStep(konami.current, e.key);
      if (konami.current === 10) {
        konami.current = 0;
        launchScuba();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("egg:scuba", launchScuba);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("egg:scuba", launchScuba);
    };
  }, []);

  return (
    <>
      {arceeMounted && <ArceePanel />}
      {terminalMounted && <Terminal now={now} />}
      {scubaRun > 0 && <ScubaCat run={scubaRun} onDone={scubaDone} />}
    </>
  );
}
