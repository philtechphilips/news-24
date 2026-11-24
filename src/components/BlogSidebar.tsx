"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { SearchItem } from "@/lib/content";
import { ChevronDownIcon, SearchIcon } from "./icons";
import { socials } from "./socials";

type Topic = { slug: string; name: string };

export default function BlogSidebar({
  title,
  description,
  topics,
  activeTopic,
  searchIndex,
}: {
  title: string;
  description: string;
  topics: Topic[];
  activeTopic?: string;
  searchIndex: SearchItem[];
}) {
  const [query, setQuery] = useState("");
  // null until toggled: CSS keeps topics collapsed on phones and open from md up.
  const [topicsOpen, setTopicsOpen] = useState<boolean | null>(null);
  const toggleTopics = () =>
    setTopicsOpen((open) => !(open ?? window.matchMedia("(min-width: 48rem)").matches));
  const searchId = useId();
  const topicsId = useId();

  const q = query.trim().toLowerCase();
  const results = q
    ? searchIndex
        .filter(
          (i) => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q),
        )
        .slice(0, 6)
    : [];

  return (
    <aside className="md:sticky md:top-28 md:max-w-68">
      <div className="border-b border-ink/10 pb-6 md:pb-8">
        <h1 className="mb-1 font-display text-4xl leading-[1.1] md:mb-3 md:text-5xl">{title}</h1>
        <p className="text-base leading-7 text-ink/80 md:text-lg">{description}</p>
      </div>

      <div className="py-4 md:pt-6">
        <label htmlFor={searchId} className="mb-2 block text-[15px]">
          Search
        </label>
        <div className="relative flex items-center rounded-lg border border-ink/5 bg-ink/3 focus-within:border-ink/30">
          <SearchIcon size={16} className="absolute left-4 opacity-65" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="Search..."
            aria-describedby={`${searchId}-hint`}
            className="w-full bg-transparent py-2.5 pr-4 pl-10 text-[15px] font-medium outline-none placeholder:text-ink/45"
          />
        </div>
        <p id={`${searchId}-hint`} className="sr-only">
          Results will appear as soon as you start typing
        </p>

        {q && (
          <ul aria-live="polite" className="mt-2 overflow-hidden rounded-lg border border-ink/10 bg-white">
            {results.map((item) => (
              <li key={item.slug} className="border-b border-ink/5 last:border-0">
                <Link href={`/blogs/${item.slug}`} className="block px-4 py-3 hover:bg-surface">
                  <span className="block text-sm leading-snug font-medium">{item.title}</span>
                  <span className="mt-0.5 block text-xs text-brand-ink">{item.category}</span>
                </Link>
              </li>
            ))}
            {results.length === 0 && (
              <li className="px-4 py-4 text-sm text-muted">No stories match “{query.trim()}”.</li>
            )}
          </ul>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={toggleTopics}
          aria-expanded={topicsOpen ?? undefined}
          aria-controls={topicsId}
          className="flex w-full items-center justify-between border-b border-ink/10 py-3 md:py-4"
        >
          <span className="text-[15px] font-medium">Topic</span>
          <ChevronDownIcon
            size={14}
            className={`transition-transform duration-200 ${
              topicsOpen === null ? "md:rotate-180" : topicsOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <ul
          id={topicsId}
          className={`border-b border-ink/10 pt-2 pb-3 ${
            topicsOpen === null ? "hidden md:block" : topicsOpen ? "block" : "hidden"
          }`}
        >
          <TopicLink href="/blogs" label="All stories" active={activeTopic === "all"} />
          {topics.map((t) => (
            <TopicLink
              key={t.slug}
              href={`/category/${t.slug}`}
              label={t.name}
              active={activeTopic === t.slug}
            />
          ))}
        </ul>
      </div>

      <div className="space-y-4 pt-6 md:pt-10">
        <h2 className="text-sm font-medium">Connect with us</h2>
        <ul className="flex items-center gap-1.5">
          {socials.map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-7 place-items-center rounded bg-ink/10 text-ink transition-colors hover:bg-ink/20"
              >
                <Icon size={13} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function TopicLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`block py-1 text-[15px] transition-opacity ${
          active ? "font-medium text-brand-ink" : "opacity-80 hover:opacity-100"
        }`}
      >
        {label}
      </Link>
    </li>
  );
}
