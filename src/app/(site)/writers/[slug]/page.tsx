import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, PostGrid, SectionHeader, WriterCard } from "@/components/cards";
import { PinIcon } from "@/components/icons";
import { socials } from "@/components/socials";
import { getBlog } from "@/lib/blog";
import { getWriter, podcastsByHost, postsByWriter } from "@/lib/content";

export async function generateStaticParams() {
  const { writers } = await getBlog();
  // Cache Components needs at least one param; the placeholder 404s.
  return writers.length ? writers.map((w) => ({ slug: w.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/writers/[slug]">): Promise<Metadata> {
  const writer = getWriter(await getBlog(), (await params).slug);
  return writer ? { title: writer.name, description: writer.bio[0] } : {};
}

export default async function WriterPage({ params }: PageProps<"/writers/[slug]">) {
  const blog = await getBlog();
  const writer = getWriter(blog, (await params).slug);
  if (!writer) notFound();

  const articles = postsByWriter(blog, writer.slug);
  const episodes = podcastsByHost(blog, writer.slug);
  const stats = [
    { label: "Articles", value: String(articles.length) },
    { label: "Podcasts", value: String(episodes.length) },
    ...(writer.joined ? [{ label: "Joined", value: writer.joined.slice(0, 4) }] : []),
  ];
  const links = socials.flatMap((s) => {
    const href = writer.social[s.key];
    return href ? [{ ...s, href }] : [];
  });
  const firstName = writer.name.split(" ")[0];

  return (
    <div className="page-shell pb-24 md:pb-32">
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
        <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-surface text-7xl">
          <Avatar writer={writer} preload sizes="(min-width: 768px) 360px, 100vw" />
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-medium text-brand-ink">
            {writer.role}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] md:text-6xl">{writer.name}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            {writer.location && (
              <span className="flex items-center gap-1">
                <PinIcon size={14} /> {writer.location}
              </span>
            )}
            {writer.joined && <span>Writing for News 24 since {writer.joined.slice(0, 4)}</span>}
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

          <dl className="mt-8 flex max-w-md divide-x divide-line rounded-xl border border-line">
            {stats.map((stat) => (
              <div key={stat.label} className="flex-1 px-4 py-4 text-center">
                <dd className="font-display text-3xl">{stat.value}</dd>
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
          <PostGrid posts={articles} />
        ) : (
          <p className="rounded-xl bg-surface py-10 text-center text-sm text-muted">
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
                  {episode.duration && (
                    <span className="shrink-0 text-xs text-muted">{episode.duration}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-20">
        <SectionHeader title="Other writers" href="/writers" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {blog.writers
            .filter((w) => w.slug !== writer.slug)
            .slice(0, 4)
            .map((w) => (
              <WriterCard key={w.slug} writer={w} />
            ))}
        </div>
      </section>
    </div>
  );
}
