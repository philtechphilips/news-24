import Link from "next/link";
import { ArrowRightIcon } from "./icons";

const pageHref = (page: number) => (page === 1 ? "/blogs" : `/blogs/page/${page}`);

/** Page numbers to show: first, last, and the current page with one neighbour each side. */
function visiblePages(current: number, total: number): (number | "…")[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ["…" as const, p] : [p]));
}

export default function Pagination({ current, total }: { current: number; total: number }) {
  if (total <= 1) return null;

  const arrow =
    "grid size-8 place-items-center rounded-full border border-ink text-ink transition-colors hover:bg-ink hover:text-white";
  const disabled = "pointer-events-none opacity-40";

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center gap-3 max-md:justify-between md:mt-14 lg:gap-4">
      <Link
        href={pageHref(Math.max(1, current - 1))}
        aria-label="Previous page"
        aria-disabled={current === 1}
        tabIndex={current === 1 ? -1 : undefined}
        className={`${arrow} ${current === 1 ? disabled : ""}`}
      >
        <ArrowRightIcon size={14} className="rotate-180" />
      </Link>
      <ul className="flex items-center gap-2">
        {visiblePages(current, total).map((p, i) =>
          p === "…" ? (
            <li key={`gap-${i}`} className="px-2">
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={pageHref(p)}
                aria-label={`Go to page ${p}`}
                aria-current={p === current ? "page" : undefined}
                className={`inline-block min-w-7 rounded-lg border border-ink/5 px-2 py-1 text-center transition-colors ${
                  p === current ? "bg-ink text-white" : "bg-surface hover:bg-ink/15"
                }`}
              >
                {p}
              </Link>
            </li>
          ),
        )}
      </ul>
      <Link
        href={pageHref(Math.min(total, current + 1))}
        aria-label="Next page"
        aria-disabled={current === total}
        tabIndex={current === total ? -1 : undefined}
        className={`${arrow} ${current === total ? disabled : ""}`}
      >
        <ArrowRightIcon size={14} />
      </Link>
    </nav>
  );
}
