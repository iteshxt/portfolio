/**
 * 2D stand-ins for each star project's object (docs/design.md §7) until the
 * 3D versions land in milestone 4: Arcee's woven rings, PatentIQ's stamp,
 * DiaChat's speech bubble. Gently animated; still with reduced motion.
 */
export function StarVisual({ slug }: { slug: string }) {
  if (slug === "arcee") {
    return (
      <svg viewBox="0 0 240 240" className="h-auto w-[min(70%,340px)] text-white" aria-hidden="true">
        <g className="origin-center animate-[spin_28s_linear_infinite] motion-reduce:animate-none" style={{ transformBox: "fill-box" }}>
          {[0, 30, 60, 90, 120, 150].map((r) => (
            <ellipse key={r} cx="120" cy="120" rx="100" ry="58" fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="2" transform={`rotate(${r} 120 120)`} />
          ))}
        </g>
        <circle cx="120" cy="120" r="34" fill="none" stroke="#FFC700" strokeWidth="2.5" />
        <path d="M120 86 141 104 133 132H107L99 104Z M120 86V154 M99 104 141 104 M107 132 120 154 133 132" fill="none" stroke="#FFC700" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }

  if (slug === "patentiq") {
    return (
      <svg viewBox="0 0 240 240" className="h-auto w-[min(72%,340px)] text-white" aria-hidden="true">
        <g transform="rotate(-12 120 120)">
          <rect x="22" y="78" width="196" height="84" rx="14" fill="none" stroke="currentColor" strokeWidth="5" />
          <rect x="34" y="90" width="172" height="60" rx="8" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="120" y="133" textAnchor="middle" fill="currentColor" style={{ font: "400 40px var(--font-serif)", letterSpacing: "0.02em" }}>
            VERIFIED
          </text>
        </g>
        <circle cx="186" cy="56" r="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 6" className="origin-center animate-[spin_16s_linear_infinite] motion-reduce:animate-none" style={{ transformBox: "fill-box" }} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 240" className="h-auto w-[min(66%,320px)] text-ink" aria-hidden="true">
      <path
        d="M58 52h124c20 0 34 14 34 34v52c0 20-14 34-34 34h-62l-40 32 8-32H58c-20 0-34-14-34-34V86c0-20 14-34 34-34Z"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {[90, 120, 150].map((cx, i) => (
        <circle
          key={cx}
          cx={cx}
          cy="112"
          r="9"
          fill="currentColor"
          className="animate-[bounce_1.2s_ease-in-out_infinite] motion-reduce:animate-none"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </svg>
  );
}
