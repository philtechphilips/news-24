import Link from "next/link";
import { ArrowRightIcon } from "./icons";
import { socials } from "./socials";
import SubscribeForm from "./SubscribeForm";

const links = [
  { href: "/blogs", label: "Blogs" },
  { href: "/writers", label: "Writers" },
  { href: "/podcasts", label: "Podcasts" },
  { href: "/about", label: "About" },
  { href: "mailto:info@news24.com", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-deep text-white">
      <section id="subscribe" className="page-shell scroll-mt-24 pt-14 pb-14 md:pt-36 md:pb-24">
        <div className="max-w-3xl space-y-6 sm:space-y-8">
          <h2 className="font-display text-4xl leading-[1.05] md:text-7xl">
            Get the news that matters
          </h2>
          <p className="max-w-lg text-base leading-7 text-white/75 md:text-lg">
            One email a week with our best reporting, analysis and guides. No spam, unsubscribe
            anytime.
          </p>
          <SubscribeForm />
        </div>
      </section>

      <div className="page-shell">
        <div className="grid gap-10 border-t border-white/15 py-12 md:grid-cols-4 md:gap-6 md:py-20">
          <div className="space-y-5">
            <Link href="/" className="font-display text-3xl leading-none tracking-tight">
              NEWS<span className="text-brand-light">24</span>
            </Link>
            <p className="max-w-60 text-sm leading-6 text-white/65">
              News, stories and ideas from our staff writers.
            </p>
            <ul className="flex gap-1.5">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid size-8 place-items-center rounded bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <Icon size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <ul className="md:col-start-4">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="group flex items-center justify-between border-b border-white/15 py-3 text-[15px] md:py-4"
                >
                  {link.label}
                  <ArrowRightIcon
                    size={13}
                    strokeWidth={2.2}
                    className="text-brand-light transition-transform duration-200 group-hover:-rotate-45"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© 2026 News 24. All rights reserved.</p>
          <a href="mailto:info@news24.com" className="transition hover:text-white">
            info@news24.com
          </a>
        </div>
      </div>
    </footer>
  );
}
