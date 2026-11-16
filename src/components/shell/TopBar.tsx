"use client";

import { useEffect, useState } from "react";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { Wordmark } from "@/components/ui/LogoMark";
import { onScrollFrame } from "@/lib/scroll-frame";
import { SoundToggle } from "./SoundToggle";

/**
 * Minimal top bar: the wordmark (sticker "i" + tesh, see ui/LogoMark). It slides away while scrolling down so it never sits
 * on top of content, and comes back on the way up.
 */
export function TopBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let y = last;
    return onScrollFrame({
      read: () => {
        y = window.scrollY;
      },
      write: () => {
        if (Math.abs(y - last) < 6) return;
        setHidden(y > last && y > 120);
        last = y;
      },
    });
  }, []);

  return (
    <header
      data-hidden={hidden}
      className="px-gutter pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between pt-5 transition-transform duration-500 ease-[var(--ease-expo-out)] data-[hidden=true]:-translate-y-[160%]"
    >
      <TransitionLink
        href="/"
        transitionLabel="Home"
        className="pointer-events-auto"
      >
        <Wordmark label="itesh, home" />
      </TransitionLink>
      {/* Leaves room for the peel corner in the top-right. */}
      <div className="-mt-2.5 mr-14">
        <SoundToggle />
      </div>
    </header>
  );
}
