import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Open Graph cards (docs/spec.md §11): the headline pair on paper with the
 * violet peel corner. Fonts are static OFL instances in src/assets/fonts.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Read at module load (not during render) so the images stay statically generated.
const fontDir = join(process.cwd(), "src/assets/fonts");
const sansFont = await readFile(join(fontDir, "MonaSans-CondensedExtraBold.ttf"));
const serifFont = await readFile(join(fontDir, "InstrumentSerif-Regular.ttf"));
const body = await readFile(join(fontDir, "MonaSans-Medium.ttf"));

export function ogCard({ kicker, sans, serif, accent = "#7A2CFF" }: { kicker: string; sans: string; serif: string; accent?: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F5F5F4", color: "#0E0E10", padding: "64px 72px", position: "relative" }}>
        {/* Peel corner: the page's sticker lifting at the top-right, night showing underneath */}
        <svg width="170" height="170" viewBox="0 0 170 170" style={{ position: "absolute", top: 0, right: 0 }}>
          <polygon points="0,0 170,0 170,170" fill="#0B0A10" />
          <polygon points="0,0 170,170 0,170" fill={accent} />
        </svg>
        <div style={{ display: "flex", fontFamily: "Instrument Serif", fontSize: 40, fontStyle: "italic" }}>itesh</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontFamily: "Instrument Serif", fontSize: 34, color: "#55555C", marginBottom: 14 }}>{kicker}</div>
          <div style={{ display: "flex", fontFamily: "Mona Sans Condensed", fontSize: 150, lineHeight: 0.86, letterSpacing: "-0.035em", textTransform: "uppercase" }}>{sans}</div>
          <div style={{ display: "flex", fontFamily: "Instrument Serif", fontSize: 132, lineHeight: 0.92, letterSpacing: "-0.02em", textTransform: "uppercase", color: accent }}>{serif}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Mona Sans", fontSize: 26, color: "#55555C" }}>
          <span>Itesh Singh Tomar · ML engineer & full-stack developer</span>
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
