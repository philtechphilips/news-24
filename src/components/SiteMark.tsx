/**
 * The News 24 mark: a white "N" on deep burgundy with a coral "live" dot.
 * Same artwork as app/icon.svg and app/apple-icon.tsx.
 */
export const MARK = {
  background: "#440220",
  letter: "M17 45V19l24 26V19",
  dot: { cx: 49, cy: 15, r: 5.5, fill: "#ff5c5c" },
} as const;

export default function SiteMark({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect width="64" height="64" rx="15" fill={MARK.background} />
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
  );
}
