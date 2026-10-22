"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, MenuIcon, SearchIcon } from "./icons";
import { socials } from "./socials";

type SearchItem = { slug: string; title: string; image: string; category: string };

const nav = [
  { href: "/about", label: "About" },
  { href: "/category/economy", label: "Economy" },
  { href: "/category/style", label: "Style" },
  { href: "/category/art", label: "Art" },
  { href: "/blogs", label: "Blogs" },
  { href: "/writers", label: "Writers" },
  { href: "/podcasts", label: "Podcasts" },
];

export default function Header({ searchIndex }: { searchIndex: SearchItem[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isHome = pathname === "/";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="-ml-2 rounded-full p-2 text-ink transition hover:bg-surface"
            aria-label="Search articles"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-full p-2 text-ink transition hover:bg-surface md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {!isHome && (
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight md:hidden"
          >
            NEWS 24
          </Link>
        )}

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-[11px] font-medium uppercase tracking-[0.12em] transition hover:text-brand ${
                    isActive(item.href) ? "text-brand" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex items-center gap-1.5">
          {socials.map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-7 place-items-center rounded-md border border-line text-ink transition hover:border-ink"
              >
                <Icon size={13} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {menuOpen && (
        <nav aria-label="Mobile" className="border-t border-line pb-4 md:hidden">
          <ul className="grid grid-cols-2 gap-1 pt-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium ${
                    isActive(item.href) ? "bg-brand-soft text-brand" : "hover:bg-surface"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {isHome ? (
        <Link href="/" className="block select-none">
          <h1 className="pt-2 pb-6 text-center text-[clamp(3.6rem,20vw,16.75rem)] leading-[0.95] font-bold tracking-[-0.04em] text-ink">
            NEWS 24
          </h1>
        </Link>
      ) : (
        <div className="hidden border-b border-line pb-5 md:block">
          <Link
            href="/"
            className="block text-center text-5xl font-bold tracking-[-0.04em]"
          >
            NEWS 24
          </Link>
        </div>
      )}

      {searchOpen && (
        <SearchDialog items={searchIndex} onClose={() => setSearchOpen(false)} />
      )}
    </header>
  );
}

function SearchDialog({
  items,
  onClose,
}: {
  items: SearchItem[];
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const results = q
    ? items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q),
      )
    : items.slice(0, 5);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 px-4 pt-[12vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search articles"
    >
      <div
        className="mx-auto w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <SearchIcon className="text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news and blogs…"
            className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-line px-2 py-1 text-[10px] font-medium text-muted"
          >
            ESC
          </button>
        </div>
        <ul className="max-h-[60vh] overflow-y-auto p-2">
          {!q && (
            <li className="px-3 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted">
              Latest
            </li>
          )}
          {results.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/blogs/${item.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface"
              >
                <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-surface">
                  <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{item.title}</span>
                  <span className="text-xs text-muted">{item.category}</span>
                </span>
              </Link>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-muted">
              No articles match “{query}”.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
