import Link from "next/link";
import { socials } from "./socials";
import SubscribeForm from "./SubscribeForm";

const columns = [
  {
    title: "Page",
    links: [
      { href: "/about", label: "About" },
      { href: "/blogs", label: "News & Blogs" },
      { href: "/writers", label: "Authors" },
      { href: "/podcasts", label: "Podcasts" },
      { href: "/#subscribe", label: "Subscription" },
    ],
  },
  {
    title: "Categories",
    links: [
      { href: "/category/economy", label: "Business" },
      { href: "/category/technology", label: "Technology" },
      { href: "/category/sports", label: "Sports" },
      { href: "/category/health", label: "Health" },
      { href: "/category/politics", label: "Politics" },
      { href: "/category/world", label: "World News" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/category/design", label: "Design guides" },
      { href: "/category/art", label: "Art & culture" },
      { href: "/category/style", label: "Style" },
      { href: "mailto:info@news24.com", label: "Contact us" },
      { href: "mailto:ads@news24.com", label: "Advertise" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-[#222] text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_2fr_auto]">
        <div className="space-y-8">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight">
              NEWS 24
            </Link>
            <a
              href="mailto:info@news24.com"
              className="mt-2 block text-xs text-white/60 hover:text-white"
            >
              info@news24.com
            </a>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-medium">Subscribe to our newsletter</p>
            <SubscribeForm variant="footer" />
            <p className="max-w-64 text-[11px] leading-relaxed text-white/50">
              From breaking news to thought-provoking opinion pieces, our
              newsletter keeps you informed &amp; engaged.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="text-xs font-semibold">{col.title}</h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-white/60 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <ul className="flex gap-3 md:flex-col">
          {socials.map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-7 place-items-center rounded-md border border-white/30 text-white/80 transition hover:border-white hover:text-white"
              >
                <Icon size={13} />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-[11px] text-white/40 sm:px-6">
          © 2026 News 24. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
