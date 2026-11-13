/**
 * Each star project's own artwork (docs/design.md §7), animated:
 * - Arcee: the real particle-ring animation from the Arcee app (animated WebP;
 *   a still frame for reduced motion).
 * - PatentIQ: its document-and-brain mark, with a scan passing over the strokes
 *   and the circuit nodes lighting up, over the glow pulse from its loader.
 * - DiaChat: its preloader, the chat bubble drawing itself and the heart filling in, on a loop.
 * All CSS (globals.css: .piq-*, .dia-*), so they cost no JavaScript.
 */

/** Circuit node centres in PatentIQ's mark (656×859 source), as % of the box. */
const PIQ_NODES = [
  [23.6, 34.6],
  [20, 43.3],
  [14.9, 52.3],
  [20, 63],
  [22.9, 72.1],
] as const;

export function StarVisual({ slug }: { slug: string }) {
  if (slug === "arcee") {
    // The ring sits inside a lot of empty canvas, so it renders larger than the other marks.
    // Capped to the box height so it never stretches a short (4:3) card; the image stays contained.
    return (
      <picture className="block aspect-square max-h-[88%] w-[min(84%,380px)]">
        <source srcSet="/projects/arcee-wave-still.webp" media="(prefers-reduced-motion: reduce)" />
        <img src="/projects/arcee-wave.webp" alt="" width={300} height={300} loading="lazy" decoding="async" className="h-full w-full object-contain" />
      </picture>
    );
  }

  if (slug === "patentiq") {
    return (
      <div aria-hidden="true" className="piq relative w-[min(46%,240px)]">
        <span className="piq-glow" />
        <span className="piq-mark" />
        <span className="piq-scan" />
        {PIQ_NODES.map(([x, y], i) => (
          <span key={i} className="piq-node" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${0.7 + i * 0.12}s` }} />
        ))}
      </div>
    );
  }

  // DiaChat's preloader paths (40×40), from the dia-chat repo.
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className="dia h-auto w-[min(50%,230px)] overflow-visible">
      <path
        className="dia-bubble"
        pathLength={1}
        d="M8 12C8 8.68629 10.6863 6 14 6H26C29.3137 6 32 8.68629 32 12V22C32 25.3137 29.3137 28 26 28H22L16 34V28H14C10.6863 28 8 25.3137 8 22V12Z"
      />
      <g className="dia-beat">
        <path
          className="dia-heart"
          pathLength={1}
          d="M20 22C20 22 24 18.5 24 16C24 14.3431 22.6569 13 21 13C20.2316 13 19.5308 13.3374 19 13.8906C18.4692 13.3374 17.7684 13 17 13C15.3431 13 14 14.3431 14 16C14 18.5 18 22 20 22Z"
        />
      </g>
    </svg>
  );
}
