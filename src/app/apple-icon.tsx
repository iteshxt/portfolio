import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon: the violet sticker with its peeled corner (logo comes later). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#7A2CFF", position: "relative" }}>
        <svg width="66" height="66" viewBox="0 0 66 66" style={{ position: "absolute", top: 0, right: 0 }}>
          <polygon points="0,0 66,0 66,66" fill="#F5F5F4" />
          <polygon points="0,0 66,66 0,66" fill="#CBB8FF" />
        </svg>
      </div>
    ),
    size,
  );
}
