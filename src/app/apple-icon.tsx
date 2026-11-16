import { ImageResponse } from "next/og";
import { LOGO_DOT, LOGO_PEEL, LOGO_STEM, LOGO_VIEWBOX } from "@/components/ui/LogoMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon: the sticker "i" (lime stem, peeling violet dot) on ink. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0E0E10" }}>
        <svg width="59" height="140" viewBox={LOGO_VIEWBOX}>
          <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="8" strokeLinejoin="round">
            <rect {...LOGO_STEM} />
            <path d={LOGO_DOT} />
          </g>
          <rect {...LOGO_STEM} fill="#CCFF33" />
          <path d={LOGO_DOT} fill="#7A2CFF" />
          <path d={LOGO_PEEL} fill="#CBB8FF" />
        </svg>
      </div>
    ),
    size,
  );
}
