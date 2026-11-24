import { ImageResponse } from "next/og";
import { MARK } from "@/components/SiteMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon. Square and full-bleed: iOS rounds the corners itself. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: MARK.background,
        }}
      >
        <svg width="150" height="150" viewBox="0 0 64 64">
          <path
            d={MARK.letter}
            fill="none"
            stroke="#fff"
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle {...MARK.dot} />
        </svg>
      </div>
    ),
    size,
  );
}
