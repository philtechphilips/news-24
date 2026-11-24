import Link from "next/link";

/** Shared admin building blocks. Server-safe (no hooks). */

export const btnPrimary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-brand disabled:cursor-wait disabled:opacity-60";
export const btnSecondary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-5 text-sm font-medium transition-colors hover:border-ink disabled:opacity-60";
export const btnIcon =
  "grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink disabled:opacity-50";
export const inputClass =
  "w-full rounded-lg border border-ink/10 bg-white px-3.5 py-2.5 text-[15px] outline-none transition placeholder:text-ink/40 focus:border-ink/40 focus:ring-4 focus:ring-ink/5";
export const labelClass = "mb-1.5 block text-sm font-medium";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
      <div>
        <h1 className="font-display text-3xl leading-tight md:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 text-[15px] text-muted">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-ink/5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${className}`}>
      {children}
    </div>
  );
}

export function StatusPill({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      <span className={`size-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-amber-500"}`} />
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <Card className="px-6 py-16 text-center">
      <p className="font-display text-xl">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{description}</p>
      {href && action && (
        <Link href={href} className={`${btnPrimary} mt-6`}>
          {action}
        </Link>
      )}
    </Card>
  );
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const formatDate = (iso: string) => dateFormat.format(new Date(iso));
