"use client";

import { useEffect, useRef, useState } from "react";
import { formatCount } from "@/lib/content";
import {
  FacebookLogo,
  LinkedInLogo,
  LinkIcon,
  MailIcon,
  ShareIcon,
  WhatsAppLogo,
  XLogo,
} from "./icons";

type Target = { label: string; Icon: typeof LinkIcon; href: (url: string, title: string) => string };

const enc = encodeURIComponent;

const targets: Target[] = [
  {
    label: "X",
    Icon: XLogo,
    href: (url, title) => `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`,
  },
  {
    label: "Facebook",
    Icon: FacebookLogo,
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
  },
  {
    label: "LinkedIn",
    Icon: LinkedInLogo,
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
  },
  {
    label: "WhatsApp",
    Icon: WhatsAppLogo,
    href: (url, title) => `https://wa.me/?text=${enc(`${title} ${url}`)}`,
  },
  {
    label: "Email",
    Icon: MailIcon,
    href: (url, title) => `mailto:?subject=${enc(title)}&body=${enc(url)}`,
  },
];

/** Share button with a menu of places to share to. Each share is counted. */
export default function ShareMenu({
  title,
  shares,
  loaded,
  onShare,
}: {
  title: string;
  shares: number;
  loaded: boolean;
  onShare: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus();
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const close = () => {
    setOpen(false);
    button.current?.focus();
  };

  // Up/down arrows move between items, Escape closes, Tab leaves.
  const onMenuKey = (e: React.KeyboardEvent) => {
    const items = [...(menu.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? [])];
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      items[(index + step + items.length) % items.length]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const url = () => window.location.href.split("#")[0];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      onShare();
    } catch {
      // Clipboard blocked: leave the menu open so another option can be picked.
      return;
    }
    close();
  }

  async function nativeShare() {
    close();
    try {
      await navigator.share({ title, url: url() });
      onShare();
    } catch {
      // Cancelled.
    }
  }

  const item =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm outline-none hover:bg-surface focus-visible:bg-surface";

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="share-menu"
        className="flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium transition hover:border-ink"
      >
        <ShareIcon size={16} />
        <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
        {loaded && shares > 0 && (
          <span className="text-muted">
            {formatCount(shares)}
            <span className="sr-only"> shares</span>
          </span>
        )}
      </button>

      {open && (
        <ul
          ref={menu}
          id="share-menu"
          role="menu"
          aria-label="Share this article"
          onKeyDown={onMenuKey}
          className="absolute right-0 bottom-full z-30 mb-2 w-56 rounded-xl border border-line bg-white p-1.5 shadow-lg sm:top-full sm:bottom-auto sm:mt-2 sm:mb-0"
        >
          <li role="none">
            <button type="button" role="menuitem" onClick={copyLink} className={item}>
              <LinkIcon size={16} /> Copy link
            </button>
          </li>
          {targets.map(({ label, Icon, href }) => (
            <li key={label} role="none">
              <a
                role="menuitem"
                href={href(url(), title)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  onShare();
                  setOpen(false);
                }}
                className={item}
              >
                <Icon size={16} /> {label}
              </a>
            </li>
          ))}
          {/* The menu only renders after a click, so `navigator` exists here. */}
          {typeof navigator.share === "function" && (
            <li role="none" className="mt-1 border-t border-line pt-1">
              <button type="button" role="menuitem" onClick={nativeShare} className={item}>
                <ShareIcon size={16} /> More options…
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
