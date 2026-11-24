import { useEffect, useState } from "react";
import type { SearchItem } from "./content";

export type SearchStatus = "idle" | "loading" | "done" | "error";

type Result = { q: string; items: SearchItem[]; status: "done" | "error" };

/**
 * Searches published posts through /api/search as the user types. Waits until
 * typing pauses, and cancels requests for text that has since changed.
 */
export function usePostSearch(query: string, delay = 250) {
  const q = query.trim();
  const [result, setResult] = useState<Result>({ q: "", items: [], status: "done" });

  useEffect(() => {
    if (!q) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Search failed (${res.status})`);
        setResult({ q, items: await res.json(), status: "done" });
      } catch {
        if (!controller.signal.aborted) setResult({ q, items: [], status: "error" });
      }
    }, delay);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, delay]);

  if (!q) return { items: [] as SearchItem[], status: "idle" as SearchStatus };
  // While a newer search is on its way, keep showing the last results.
  const status: SearchStatus = result.q === q ? result.status : "loading";
  return { items: result.items, status };
}
