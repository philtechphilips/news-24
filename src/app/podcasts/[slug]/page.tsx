import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PodcastCard, SectionHeader } from "@/components/cards";
import { ClockIcon, MicIcon } from "@/components/icons";
import { formatDate, getPodcast, getWriter } from "@/lib/content";
import { podcasts } from "@/lib/data";

export function generateStaticParams() {
  return podcasts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/podcasts/[slug]">): Promise<Metadata> {
  const podcast = getPodcast((await params).slug);
  return podcast ? { title: podcast.title, description: podcast.description } : {};
}

export default async function PodcastPage({ params }: PageProps<"/podcasts/[slug]">) {
  const podcast = getPodcast((await params).slug);
  if (!podcast) notFound();
  const host = getWriter(podcast.host);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
          <Image
            src={podcast.image}
            alt={podcast.imageAlt}
            fill
            preload
            sizes="(min-width: 768px) 540px, 100vw"
            className="object-cover opacity-85"
          />
        </div>

        <div className="flex flex-col">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            <MicIcon size={14} /> Podcast episode
          </p>
          <h1 className="mt-3 text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
            {podcast.title}
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-muted">{podcast.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
            {host && (
              <Link href={`/writers/${host.slug}`} className="flex items-center gap-2 hover:text-ink">
                <span className="relative size-7 overflow-hidden rounded-full bg-surface">
                  <Image src={host.avatar} alt="" fill sizes="28px" className="object-cover" />
                </span>
                Hosted by <span className="font-medium text-ink">{host.name}</span>
              </Link>
            )}
            <time dateTime={podcast.date}>{formatDate(podcast.date)}</time>
            <span className="flex items-center gap-1">
              <ClockIcon size={14} /> {podcast.duration}
            </span>
          </div>

          <div className="mt-8 rounded-xl border border-dashed border-line bg-surface p-5 text-sm text-muted">
            The audio for this episode will be available here soon.
          </div>

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
          {podcasts
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
