"use client";

import { useEffect, useState } from "react";

const FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Live clock in Delhi, e.g. "01:27 IST". Server renders a placeholder; the browser fills it in. */
export function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(FORMAT.format(new Date()));
    const first = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 15_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <time className={className} suppressHydrationWarning>
      {time ?? "--:--"} IST
    </time>
  );
}
