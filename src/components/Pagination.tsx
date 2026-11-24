"use client";

import { ArrowRightIcon } from "./icons";

/** Page numbers to show: first, last, and the current page with one neighbour each side. */
function visiblePages(current: number, total: number): (number | "…")[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ["…" as const, p] : [p]));
}

export default function Pagination({
  current,
  total,
  onChange,
  disabled = false,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}) {
  if (total <= 1) return null;

  const arrow =
    "grid size-8 place-items-center rounded-full border border-ink text-ink transition-colors hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center gap-3 max-md:justify-between md:mt-14 lg:gap-4">
      <button
        type="button"
        aria-label="Previous page"
        disabled={disabled || current === 1}
        onClick={() => onChange(current - 1)}
        className={arrow}
      >
        <ArrowRightIcon size={14} className="rotate-180" />
      </button>
      <ul className="flex items-center gap-2">
        {visiblePages(current, total).map((p, i) =>
          p === "…" ? (
            <li key={`gap-${i}`} className="px-2">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                aria-label={`Go to page ${p}`}
                aria-current={p === current ? "page" : undefined}
                disabled={disabled}
                onClick={() => p !== current && onChange(p)}
                className={`inline-block min-w-7 rounded-lg border border-ink/5 px-2 py-1 text-center transition-colors ${
                  p === current ? "bg-ink text-white" : "bg-surface hover:bg-ink/15"
                }`}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>
      <button
        type="button"
        aria-label="Next page"
        disabled={disabled || current === total}
        onClick={() => onChange(current + 1)}
        className={arrow}
      >
        <ArrowRightIcon size={14} />
      </button>
    </nav>
  );
}
