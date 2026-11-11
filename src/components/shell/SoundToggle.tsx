"use client";

import { useEffect } from "react";
import { SoundOff, SoundOn } from "@/components/icons";
import { play, unlockSoundOnFirstGesture } from "@/lib/sound";
import { useUI } from "@/store/ui";

/** Mute toggle for the UI sounds (docs/design.md §9). The choice is remembered. */
export function SoundToggle() {
  const muted = useUI((s) => s.muted);
  const setMuted = useUI((s) => s.setMuted);
  const hydrateMuted = useUI((s) => s.hydrateMuted);

  useEffect(() => {
    hydrateMuted();
    unlockSoundOnFirstGesture();
  }, [hydrateMuted]);

  return (
    <button
      type="button"
      aria-pressed={!muted}
      aria-label={muted ? "Turn sound on" : "Mute sounds"}
      title={muted ? "Sound off" : "Sound on"}
      onClick={() => {
        setMuted(!muted);
        if (muted) window.setTimeout(() => play("select"), 0);
      }}
      className="pointer-events-auto flex size-11 items-center justify-center rounded-full text-[22px] transition-colors hover:bg-fg/5"
    >
      {muted ? <SoundOff /> : <SoundOn />}
    </button>
  );
}
