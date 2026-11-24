import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";

export default function NotFound() {
  return (
    <SiteChrome>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="font-display text-8xl text-brand">404</p>
        <h1 className="mt-4 font-display text-3xl">We couldn&apos;t find that page</h1>
        <p className="mt-2 text-sm text-muted">
          The story may have moved, or the link might be mistyped.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-ink px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-brand"
          >
            Back to home
          </Link>
          <Link
            href="/blogs"
            className="rounded-full border border-ink px-5 py-3 text-[15px] font-medium transition-colors hover:bg-ink hover:text-white"
          >
            Browse stories
          </Link>
        </div>
      </div>
    </SiteChrome>
  );
}
