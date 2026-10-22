import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-7xl font-bold tracking-tight text-brand">404</p>
      <h1 className="mt-4 text-2xl font-medium">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-sm text-muted">
        The story may have moved, or the link might be mistyped.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-sm bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand-dark"
        >
          Back to home
        </Link>
        <Link
          href="/blogs"
          className="rounded-sm border border-ink px-4 py-2 text-xs font-medium hover:bg-ink hover:text-white"
        >
          Browse stories
        </Link>
      </div>
    </div>
  );
}
