import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard, SectionHeader, WriterCard } from "@/components/cards";
import { PinIcon } from "@/components/icons";
import { socials } from "@/components/socials";
import { formatCount, formatDate, getWriter, postsByWriter } from "@/lib/content";
import { podcasts, writers } from "@/lib/data";

export function generateStaticParams() {
  return writers.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/writers/[slug]">): Promise<Metadata> {
  const writer = getWriter((await params).slug);
  return writer ? { title: writer.name, description: writer.bio[0] } : {};
}

export default async function WriterPage({ params }: PageProps<"/writers/[slug]">) {
  const writer = getWriter((await params).slug);
  if (!writer) notFound();

  const articles = postsByWriter(writer.slug);
  const episodes = podcasts.filter((p) => p.host === writer.slug);
  const stats = [
    { label: "Articles", value: String(articles.length) },
    { label: "Reads", value: formatCount(articles.reduce((sum, p) => sum + p.views, 0)) },
    { label: "Likes", value: formatCount(articles.reduce((sum, p) => sum + p.likes, 0)) },
  ];
  const links = socials.flatMap((s) => {
    const href = writer.social[s.key];
    return href ? [{ ...s, href }] : [];
  });
  const firstName = writer.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 pt-10 text-xs text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/writers" className="hover:text-ink">
          Writers
        </Link>
      </nav>

      <section className="mt-8 grid gap-10 md:grid-cols-[minmax(0,360px)_1fr] md:gap-14">
        <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-surface">
          <Image
            src={writer.avatar}
            alt={`Portrait of ${writer.name}`}
            fill
            preload
            sizes="(min-width: 768px) 360px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {writer.role}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">{writer.name}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span className="flex items-center gap-1">
              <PinIcon size={14} /> {writer.location}
            </span>
            <span>Writing for News 24 since {formatDate(writer.joined)}</span>
          </p>

          <div className="mt-6 space-y-4 text-[15px] leading-7 text-neutral-700">
            {writer.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Covers">
            {writer.beats.map((beat) => (
              <li key={beat} className="rounded-full border border-line px-3 py-1 text-xs font-medium">
                {beat}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid max-w-md grid-cols-3 divide-x divide-line rounded-xl border border-line">
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 py-4 text-center">
                <dd className="text-2xl font-semibold">{stat.value}</dd>
                <dt className="mt-1 text-[11px] text-muted">{stat.label}</dt>
              </div>
            ))}
          </dl>

          {links.length > 0 && (
            <ul className="mt-8 flex gap-2">
              {links.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${writer.name} on ${label}`}
                    className="grid size-9 place-items-center rounded-md border border-line transition hover:border-ink"
                  >
                    <Icon size={15} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeader title={`Articles by ${firstName}`} />
        {articles.length > 0 ? (
          <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg bg-surface py-10 text-center text-sm text-muted">
            {firstName} hasn&apos;t published any articles yet.
          </p>
        )}
      </section>

      {episodes.length > 0 && (
        <section className="mt-16">
          <SectionHeader title={`Podcasts hosted by ${firstName}`} href="/podcasts" />
          <ul className="divide-y divide-line border-y border-line">
            {episodes.map((episode) => (
              <li key={episode.slug}>
                <Link
                  href={`/podcasts/${episode.slug}`}
                  className="flex items-center justify-between gap-4 py-4 hover:text-brand"
                >
                  <span className="text-sm font-medium">{episode.title}</span>
                  <span className="shrink-0 text-xs text-muted">{episode.duration}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-20">
        <SectionHeader title="Other writers" href="/writers" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {writers
            .filter((w) => w.slug !== writer.slug)
            .slice(0, 4)
            .map((w) => (
              <WriterCard key={w.slug} writer={w} showCount />
            ))}
        </div>
      </section>
    </div>
  );
}
