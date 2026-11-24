"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth-actions";
import {
  ArrowUpRightIcon,
  FileTextIcon,
  GridIcon,
  LogOutIcon,
  TagIcon,
  UsersIcon,
} from "../icons";
import SiteMark from "../SiteMark";

const nav = [
  { href: "/admin", label: "Dashboard", Icon: GridIcon },
  { href: "/admin/posts", label: "Posts", Icon: FileTextIcon },
  { href: "/admin/categories", label: "Categories", Icon: TagIcon },
  { href: "/admin/users", label: "Users", Icon: UsersIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 z-30 bg-brand-deep text-white lg:h-screen lg:w-64 lg:shrink-0">
      <div className="flex h-full flex-col lg:px-4 lg:py-6">
        <div className="flex items-center justify-between gap-3 px-5 pt-4 lg:px-2 lg:pt-0">
          <Link href="/admin" className="flex items-center gap-2.5">
            <SiteMark size={32} className="rounded-lg ring-1 ring-white/15" />
            <span className="font-display text-xl leading-none">
              NEWS<span className="text-brand-light">24</span>
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-brand-light">
              Admin
            </span>
            <form action={logout} className="lg:hidden">
              <button
                type="submit"
                aria-label="Log out"
                className="grid size-9 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
              >
                <LogOutIcon size={18} />
              </button>
            </form>
          </div>
        </div>

        <nav aria-label="Admin" className="mt-3 overflow-x-auto px-3 lg:mt-10 lg:px-0">
          <ul className="flex gap-1 pb-3 lg:flex-col lg:pb-0">
            {nav.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <li key={href} className="shrink-0">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] transition-colors ${
                      active ? "bg-white/12 text-white" : "text-white/70 hover:bg-white/6 hover:text-white"
                    }`}
                  >
                    <Icon size={18} className={active ? "text-brand-light" : ""} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto hidden space-y-1 border-t border-white/10 pt-4 lg:block">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-white/70 transition-colors hover:bg-white/6 hover:text-white"
          >
            <ArrowUpRightIcon size={18} />
            View site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-white/70 transition-colors hover:bg-white/6 hover:text-white"
            >
              <LogOutIcon size={18} />
              Log out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
