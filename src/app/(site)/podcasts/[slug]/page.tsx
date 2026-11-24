import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, Cover, PodcastCard, SectionHeader } from "@/components/cards";
import { ClockIcon, MicIcon } from "@/components/icons";
import { getBlog } from "@/lib/blog";
import { formatDate, getPodcast, getWriter } from "@/lib/content";

export async function generateStaticParams() {
  const { podcasts } = await getBlog();
  // Cache Components needs at least one param; the placeholder 404s.
  return podcasts.length ? podcasts.map((p) => ({ slug: p.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/podcasts/[slug]">): Promise<Metadata> {
  const podcast = getPodcast(await getBlog(), (await params).slug);
  return podcast ? { title: podcast.title, description: podcast.description } : {};
}

export default async function PodcastPage({ params }: PageProps<"/podcasts/[slug]">) {
  const blog = await getBlog();
  const podcast = getPodcast(blog, (await params).slug);
  if (!podcast) notFound();
  const host = getWriter(blog, podcast.host);

  return (
    <div className="page-shell pb-24 md:pb-32">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 pt-10 text-xs text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/podcasts" className="hover:text-ink">
          Podcasts
        </Link>
      </nav>

      <section className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-night">
          <Cover
            src={podcast.image}
            alt={podcast.imageAlt}
            preload
            sizes="(min-width: 768px) 540px, 100vw"
            className="opacity-85"
          />
        </div>

        <div className="flex flex-col">
          <p className="flex items-center gap-2 text-sm font-medium text-brand-ink">
            <MicIcon size={14} /> Podcast episode
          </p>
          <h1 className="mt-3 font-display text-3xl leading-[1.1] md:text-5xl">
            {podcast.title}
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-muted">{podcast.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
            {host && (
              <Link href={`/writers/${host.slug}`} className="flex items-center gap-2 hover:text-ink">
                <span className="relative size-7 overflow-hidden rounded-full bg-surface text-[10px]">
                  <Avatar writer={host} sizes="28px" />
                </span>
                Hosted by <span className="font-medium text-ink">{host.name}</span>
              </Link>
            )}
            <time dateTime={podcast.date}>{formatDate(podcast.date)}</time>
            {podcast.duration && (
              <span className="flex items-center gap-1">
                <ClockIcon size={14} /> {podcast.duration}
              </span>
            )}
          </div>

          {podcast.audioUrl ? (
            <audio controls preload="none" src={podcast.audioUrl} className="mt-8 w-full" />
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-line bg-surface p-5 text-sm text-muted">
              The audio for this episode will be available here soon.
            </div>
          )}

          <h2 className="mt-10 text-lg font-medium">In this episode</h2>
          <ul className="mt-4 space-y-3">
            {podcast.notes.map((note) => (
              <li key={note} className="flex gap-3 text-sm leading-6 text-neutral-700">
                <span className="mt-2 size-2 shrink-0 bg-brand" aria-hidden="true" />
                {note}
              </li>
            ))}
          </ul>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Topics">
            {podcast.topics.map((topic) => (
              <li key={topic} className="rounded-full border border-line px-3 py-1 text-xs font-medium">
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-20">
        <SectionHeader title="More episodes" href="/podcasts" />
        <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {blog.podcasts
            .filter((p) => p.slug !== podcast.slug)
            .slice(0, 3)
            .map((p) => (
              <PodcastCard key={p.slug} podcast={p} />
            ))}
        </div>
      </section>
    </div>
  );
}
