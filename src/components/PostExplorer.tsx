"use client";

import { useState } from "react";
import { SearchIcon } from "./icons";

type Item = { slug: string; title: string; excerpt: string; category: string };
type Option = { slug: string; name: string };

/**
 * Filters a server-rendered grid of cards by search text and category.
 * `cards` maps each post slug to its pre-rendered card so the cards stay server components.
 */
export default function PostExplorer({
  items,
  categories,
  cards,
}: {
  items: Item[];
  categories: Option[];
  cards: Record<string, React.ReactNode>;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const q = query.trim().toLowerCase();
  const visible = items.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      (!q || item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q)),
  );

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
      active
        ? "border-ink bg-ink text-white"
        : "border-line text-ink hover:border-ink"
    }`;

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0 lg:pb-0">
          <button type="button" onClick={() => setCategory("all")} className={chip(category === "all")}>
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(c.slug)}
              className={chip(category === c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>
        <label className="flex h-10 w-full items-center gap-2 rounded-full border border-line px-4 focus-within:border-ink lg:w-72">
          <SearchIcon size={16} className="text-muted" />
          <span className="sr-only">Search articles</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </label>
      </div>

      <p className="mt-6 text-xs text-muted" aria-live="polite">
        Showing {visible.length} of {items.length} articles
      </p>

      {visible.length > 0 ? (
        <div className="mt-6 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <div key={item.slug}>{cards[item.slug]}</div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-line py-16 text-center">
          <p className="text-sm font-medium">No articles found</p>
          <p className="mt-1 text-xs text-muted">Try another search or category.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-4 rounded-full border border-brand px-4 py-1.5 text-xs font-medium text-brand hover:bg-brand hover:text-white"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
