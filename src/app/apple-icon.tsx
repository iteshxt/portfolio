import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon: the violet sticker with its peeled corner (logo comes later). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#7A2CFF", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderTop: "62px solid #F5F5F4", borderLeft: "62px solid transparent", display: "flex" }} />
        <div style={{ position: "absolute", top: 0, right: 62, width: 0, height: 0, borderBottom: "62px solid #CBB8FF", borderRight: "62px solid transparent", display: "flex" }} />
      </div>
    ),
    size,
  );
}
