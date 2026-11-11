"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { StarVisual } from "@/components/home/StarVisual";
import { cn } from "@/lib/cn";
import { tier3D, type Tier3D } from "@/lib/device";

// three.js only loads on pages that show a stage, and only on capable devices.
const StarScene = dynamic(() => import("@/components/three/StarScene"), { ssr: false, loading: () => null });

/**
 * Stage for a star project's 3D object (docs/design.md §7). Server-renders the
 * 2D drawing; capable devices swap in the 3D scene once it's ready, and the
 * scene only renders while the stage is on screen.
 */
export function StarStage({ slug, className }: { slug: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState<Tier3D>("off");
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = tier3D();
    const io = new IntersectionObserver(([entry]) => {
      // The tier is decided on first sight so three.js isn't fetched for stages never seen.
      setTier(t);
      setInView(entry.isIntersecting);
    }, { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-fly-target={slug} className={cn("relative overflow-hidden", className)}>
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-700",
          ready && tier !== "off" ? "opacity-0" : "opacity-100",
        )}
      >
        <StarVisual slug={slug} />
      </div>
      {tier !== "off" && (
        <div className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
          <StarScene slug={slug} tier={tier} active={inView} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
