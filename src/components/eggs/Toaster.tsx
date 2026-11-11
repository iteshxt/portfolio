"use client";

import { Close, Spark } from "@/components/icons";
import { useUI } from "@/store/ui";

/** Little sticker-style toasts for found eggs and notes. */
export function Toaster() {
  const toasts = useUI((s) => s.toasts);
  const dismiss = useUI((s) => s.dismissToast);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-24 left-4 z-[78] flex w-[min(360px,calc(100vw-32px))] flex-col gap-3 sm:bottom-6 sm:left-6"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="toast-in pointer-events-auto flex items-start gap-3 rounded-[20px] border-[4px] border-white bg-lavender p-4 text-violet-ink shadow-[0_18px_40px_-18px_rgb(0_0_0/0.5)]"
        >
          <Spark className="mt-0.5 shrink-0 text-[20px]" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold leading-snug">{t.title}</p>
            {t.body && <p className="mt-0.5 text-[14px] leading-snug opacity-80">{t.body}</p>}
          </div>
          <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="shrink-0 rounded-full p-1 text-[16px] hover:bg-black/10">
            <Close />
          </button>
        </div>
      ))}
    </div>
  );
}
