"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SearchItem } from "@/lib/content";
import { CloseIcon, MenuIcon, SearchIcon } from "./icons";

const nav = [
  { href: "/blogs", label: "Blogs" },
  { href: "/writers", label: "Writers" },
  { href: "/podcasts", label: "Podcasts" },
  { href: "/about", label: "About" },
];

export default function Header({ searchIndex }: { searchIndex: SearchItem[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href ||
    pathname.startsWith(`${href}/`) ||
    (href === "/blogs" && pathname.startsWith("/category/"));

  return (
    <header
      className={`sticky inset-x-0 top-0 z-40 border-b bg-white transition-colors duration-200 ${
        scrolled || menuOpen ? "border-ink/10" : "border-transparent"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only rounded-sm bg-white px-2 text-sm focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <div className="page-shell flex h-15 items-center gap-x-6 md:h-16 lg:h-20 lg:gap-x-8">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="shrink-0 font-display text-2xl leading-none tracking-tight"
        >
          NEWS<span className="text-brand">24</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-x-6">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`border-b py-1 text-[15px] transition-colors ${
                    isActive(item.href)
                      ? "border-current"
                      : "border-transparent hover:border-current"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="grid size-10 place-items-center rounded-full transition-colors hover:bg-surface"
            aria-label="Search articles"
          >
            <SearchIcon />
          </button>
          <Link
            href="/login"
            className="hidden rounded-full border border-ink px-5 py-2.5 text-[15px] leading-none font-medium transition-colors hover:bg-ink hover:text-white sm:inline-flex"
          >
            Log in
          </Link>
          <a
            href="#subscribe"
            className="hidden rounded-full border border-ink bg-ink px-5 py-2.5 text-[15px] leading-none font-medium text-white transition-colors hover:border-brand hover:bg-brand sm:inline-flex"
          >
            Subscribe
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="grid size-10 place-items-center rounded-full transition-colors hover:bg-surface lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Mobile" className="page-shell pb-6 lg:hidden">
          <ul className="border-t border-ink/10">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block border-b border-ink/10 py-4 font-display text-2xl ${
                    isActive(item.href) ? "text-brand-ink" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-3 sm:hidden">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex-1 rounded-full border border-ink py-3 text-center text-[15px] font-medium"
            >
              Log in
            </Link>
            <a
              href="#subscribe"
              onClick={() => setMenuOpen(false)}
              className="flex-1 rounded-full bg-ink py-3 text-center text-[15px] font-medium text-white"
            >
              Subscribe
            </a>
          </div>
        </nav>
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
      className="fixed inset-0 z-50 bg-brand-deep/60 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search articles"
    >
      <div
        className="mx-auto w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-ink/10 px-4">
          <SearchIcon className="text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news and blogs…"
            className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-ink/10 px-2 py-1 text-[10px] font-medium text-muted"
          >
            ESC
          </button>
        </div>
        <ul className="max-h-[60vh] overflow-y-auto p-2">
          {!q && (
            <li className="px-3 pt-2 pb-1 text-xs font-medium text-muted">Latest</li>
          )}
          {results.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/blogs/${item.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface"
              >
                <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-surface">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="48px"
                      unoptimized={!item.image.startsWith("https://images.unsplash.com/")}
                      className="object-cover"
                    />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{item.title}</span>
                  <span className="text-xs text-brand-ink">{item.category}</span>
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
