"use client";

import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import type { Tier3D } from "@/lib/device";
import { ArceeOrb } from "./ArceeOrb";
import { ChatBubble } from "./ChatBubble";
import { PatentStamp } from "./PatentStamp";

export type StageInput = {
  /** Pointer is over the stage. */
  hover: { current: boolean };
  /** Increments on every click/tap of the stage. */
  poke: { current: number };
  lite: boolean;
};

/**
 * One canvas per stage, loaded lazily (docs/spec.md §7). Renders only while
 * the stage is on screen (`active`), with the pixel ratio capped per tier.
 */
export default function StarScene({
  slug,
  tier,
  active,
  onReady,
}: {
  slug: string;
  tier: Exclude<Tier3D, "off">;
  active: boolean;
  onReady: () => void;
}) {
  const hover = useRef(false);
  const poke = useRef(0);
  const input: StageInput = { hover, poke, lite: tier === "lite" };

  return (
    <div
      className="h-full w-full cursor-pointer"
      onPointerEnter={() => (hover.current = true)}
      onPointerLeave={() => (hover.current = false)}
      onClick={() => (poke.current += 1)}
    >
      <Canvas
        flat
        dpr={[1, tier === "full" ? 1.75 : 1.25]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: tier === "full", alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 35 }}
        onCreated={() => onReady()}
        aria-hidden="true"
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 5]} intensity={2.4} />
        <directionalLight position={[-4, -2, 3]} intensity={0.6} />
        {slug === "arcee" && <ArceeOrb {...input} />}
        {slug === "patentiq" && <PatentStamp {...input} />}
        {slug === "diachat" && <ChatBubble {...input} />}
      </Canvas>
    </div>
  );
}
