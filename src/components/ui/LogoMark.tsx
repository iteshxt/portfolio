/**
 * The logo: an "i" made of two die-cut stickers, a lime stem and a violet dot whose
 * corner is peeling. `line` is the one-colour version (prints, monochrome icons) and
 * draws in currentColor. Geometry is shared with src/app/icon.svg and apple-icon.tsx.
 */
export const LOGO_STEM = { x: -11, y: -12, width: 22, height: 54, rx: 11, transform: "rotate(6 0 15)" } as const;
export const LOGO_DOT = "M10 -34A13 13 0 1 0 -3 -21Z";
export const LOGO_PEEL = "M10 -34Q0 -31 -3 -21Z";
export const LOGO_VIEWBOX = "-22 -52 42 100";

export function LogoMark({ variant = "color", className }: { variant?: "color" | "line"; className?: string }) {
  if (variant === "line") {
    return (
      <svg viewBox={LOGO_VIEWBOX} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round">
        <rect {...LOGO_STEM} />
        <path d={LOGO_DOT} />
        <path d={LOGO_PEEL} />
      </svg>
    );
  }
  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} aria-hidden="true">
      <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="8" strokeLinejoin="round">
        <rect {...LOGO_STEM} />
        <path d={LOGO_DOT} />
      </g>
      <rect {...LOGO_STEM} fill="#CCFF33" />
      <path d={LOGO_DOT} fill="#7A2CFF" />
      <path d={LOGO_PEEL} fill="#CBB8FF" />
    </svg>
  );
}

/**
 * The wordmark: the sticker "i" standing in for the first letter of "itesh". `line` on violet
 * (the intro), where the violet dot would vanish. Screen readers get `label` ("itesh" by
 * default) as one word; the drawn "i" + "tesh" are hidden from them so it isn't read as "tesh".
 */
export function Wordmark({
  className = "",
  variant = "color",
  size = "text-[28px]",
  label = "itesh",
}: {
  className?: string;
  variant?: "color" | "line";
  /** Font-size class; the mark scales with it. */
  size?: string;
  label?: string;
}) {
  return (
    <span className={`inline-flex items-end gap-[0.06em] font-serif leading-none italic ${size} ${className}`}>
      <span className="sr-only">{label}</span>
      <LogoMark variant={variant} className="h-[1.18em] w-auto -translate-y-[0.04em]" />
      <span aria-hidden="true">tesh</span>
    </span>
  );
}
