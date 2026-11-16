import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Open Graph cards (docs/spec.md §11), in the site's language: a sentence-case
 * statement on a cutting mat with one die-cut word sticker, the serif kicker,
 * the "itesh" wordmark and the violet peel corner. Fonts are static OFL
 * instances in src/assets/fonts.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const TONES = {
  violet: { bg: "#7A2CFF", fg: "#FFFFFF" },
  lime: { bg: "#CCFF33", fg: "#2B3600" },
  sunflower: { bg: "#FFC700", fg: "#4A3A00" },
  tomato: { bg: "#FF4B2B", fg: "#2A0700" },
  lavender: { bg: "#CBB8FF", fg: "#3A0E8C" },
} as const;
export type OgTone = keyof typeof TONES;
export type OgPart = string | { sticker: string; tone?: OgTone; bg?: string; fg?: string; tilt?: number };

// Read at module load (not during render) so the images stay statically generated.
const fontDir = join(process.cwd(), "src/assets/fonts");
const sansFont = await readFile(join(fontDir, "MonaSans-CondensedExtraBold.ttf"));
const serifFont = await readFile(join(fontDir, "InstrumentSerif-Regular.ttf"));
const body = await readFile(join(fontDir, "MonaSans-Medium.ttf"));

export function ogCard({ kicker, parts, sub, size = 104 }: { kicker: string; parts: OgPart[]; sub?: string; size?: number }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F5F5F4",
          backgroundImage: "linear-gradient(#E3E2E6 1px, transparent 1px), linear-gradient(90deg, #E3E2E6 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          color: "#0E0E10",
          padding: "60px 72px",
          position: "relative",
        }}
      >
        {/* The peel corner: the page lifting like a sticker at the top-right. */}
        <svg width="150" height="150" viewBox="0 0 150 150" style={{ position: "absolute", top: 0, right: 0 }}>
          <polygon points="0,0 150,0 150,150" fill="#0B0A10" />
          <polygon points="0,0 150,150 0,150" fill="#7A2CFF" />
        </svg>
        <div style={{ display: "flex", fontFamily: "Instrument Serif", fontSize: 44, fontStyle: "italic" }}>itesh</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontFamily: "Instrument Serif", fontSize: 36, fontStyle: "italic", color: "#6B6873", marginBottom: 18 }}>{kicker}</div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", fontFamily: "Mona Sans Condensed", fontSize: size, lineHeight: 1.12, letterSpacing: "-0.04em", maxWidth: 1000 }}>
            {parts.map((p, i) =>
              typeof p === "string" ? (
                <span key={i} style={{ display: "flex", whiteSpace: "pre" }}>
                  {p}
                </span>
              ) : (
                <span
                  key={i}
                  style={{
                    display: "flex",
                    background: p.bg ?? TONES[p.tone ?? "violet"].bg,
                    color: p.fg ?? TONES[p.tone ?? "violet"].fg,
                    border: "7px solid #FFFFFF",
                    borderRadius: 26,
                    padding: "0px 22px 8px",
                    margin: "0 6px",
                    transform: `rotate(${p.tilt ?? -2.5}deg)`,
                    boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
                  }}
                >
                  {p.sticker}
                </span>
              ),
            )}
          </div>
          {sub && <div style={{ display: "flex", fontFamily: "Mona Sans", fontSize: 30, color: "#55555C", marginTop: 22, maxWidth: 940 }}>{sub}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Mona Sans", fontSize: 26, color: "#55555C" }}>
          <span>ML engineer &amp; full-stack developer</span>
          <span>iteshxt.me</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Mona Sans Condensed", data: sansFont, weight: 800, style: "normal" },
        { name: "Instrument Serif", data: serifFont, weight: 400, style: "normal" },
        { name: "Mona Sans", data: body, weight: 500, style: "normal" },
      ],
    },
  );
}
