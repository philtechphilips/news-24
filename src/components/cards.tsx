import Image from "next/image";
import Link from "next/link";
import {
  formatDate,
  getCategory,
  getWriter,
  postsByWriter,
  readTime,
} from "@/lib/content";
import type { Podcast, Post, Writer } from "@/lib/types";
import { ArrowUpRightIcon, MicIcon } from "./icons";

export function CategoryTag({ slug, link = false }: { slug: string; link?: boolean }) {
  const category = getCategory(slug);
  if (!category) return null;
  const className = `inline-block rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${category.tagClass}`;
  return link ? (
    <Link href={`/category/${category.slug}`} className={className}>
      {category.name}
    </Link>
  ) : (
    <span className={className}>{category.name}</span>
  );
}

export function SectionHeader({
  title,
  href,
  linkLabel = "View All",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-medium tracking-tight">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs font-medium text-brand hover:underline"
        >
          {linkLabel} <ArrowUpRightIcon size={13} />
        </Link>
      )}
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="py-10 md:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
      {description && (
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

export function BlogCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col">
      <Link
        href={`/blogs/${post.slug}`}
        className="relative block aspect-4/3 overflow-hidden rounded-md bg-surface"
      >
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3">
          <CategoryTag slug={post.category} />
        </span>
      </Link>
      <h3 className="mt-4 line-clamp-2 text-[15px] leading-snug font-medium">
        <Link href={`/blogs/${post.slug}`} className="hover:text-brand">
          {post.title}
        </Link>
      </h3>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>{readTime(post)}</span>
      </div>
      <Link
        href={`/blogs/${post.slug}`}
        className="mt-3 w-fit rounded-full border border-brand px-3 py-1 text-[10px] font-medium text-brand transition hover:bg-brand hover:text-white"
      >
        Read more
      </Link>
    </article>
  );
}

export function NewsListItem({ post }: { post: Post }) {
  const category = getCategory(post.category);
  return (
    <article className="group flex flex-col gap-4 rounded-lg border border-line bg-white p-3 shadow-[0_1px_8px_rgba(0,0,0,0.04)] sm:flex-row">
      <Link
        href={`/blogs/${post.slug}`}
        className="relative aspect-16/10 shrink-0 overflow-hidden rounded-md bg-surface sm:aspect-auto sm:h-auto sm:w-48"
      >
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes="(min-width: 640px) 192px, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex min-w-0 flex-col py-1">
        <h3 className="text-[15px] leading-snug font-medium">
          <Link href={`/blogs/${post.slug}`} className="hover:text-brand">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted">{post.excerpt}</p>
        <div className="mt-auto flex gap-8 pt-3 text-[10px] text-muted">
          <span>{category?.name}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      </div>
    </article>
  );
}

export function TrendingCard({ posts, title = "Trending News" }: { posts: Post[]; title?: string }) {
  return (
    <aside className="rounded-lg border border-line bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <h2 className="text-sm font-medium">{title}</h2>
      <ol className="mt-5 space-y-6">
        {posts.map((post) => (
          <li key={post.slug} className="flex gap-3">
            <span className="mt-1.5 size-2 shrink-0 bg-brand" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <Link
                href={`/blogs/${post.slug}`}
                className="line-clamp-2 text-xs leading-5 font-medium hover:text-brand"
              >
                {post.title}
              </Link>
              <div className="mt-2 flex justify-between gap-2 text-[10px] text-muted">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>{getWriter(post.writer)?.name}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}

export function WriterCard({ writer, showCount = false }: { writer: Writer; showCount?: boolean }) {
  const count = postsByWriter(writer.slug).length;
  return (
    <Link href={`/writers/${writer.slug}`} className="group block">
      <div className="relative aspect-4/5 overflow-hidden rounded-md bg-surface">
        <Image
          src={writer.avatar}
          alt={`Portrait of ${writer.name}`}
          fill
          sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <p className="mt-3 text-sm font-medium group-hover:text-brand">{writer.name}</p>
      <p className="text-xs text-muted">
        {writer.role}
        {showCount && ` · ${count} ${count === 1 ? "article" : "articles"}`}
      </p>
    </Link>
  );
}

export function PodcastCard({ podcast }: { podcast: Podcast }) {
  return (
    <article className="group flex flex-col">
      <Link
        href={`/podcasts/${podcast.slug}`}
        className="relative block aspect-4/3 overflow-hidden rounded-md bg-night"
      >
        <Image
          src={podcast.image}
          alt={podcast.imageAlt}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover opacity-80 transition duration-500 group-hover:scale-105"
        />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-14 place-items-center rounded-full border-2 border-white/90 bg-black/30 text-white backdrop-blur-sm">
            <MicIcon size={22} />
          </span>
        </span>
        <span className="absolute right-3 bottom-3 rounded-sm bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
          {podcast.duration}
        </span>
      </Link>
      <h3 className="mt-4 text-[15px] leading-snug font-medium">
        <Link href={`/podcasts/${podcast.slug}`} className="hover:text-brand">
          {podcast.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{podcast.description}</p>
      <Link
        href={`/podcasts/${podcast.slug}`}
        className="mt-4 w-fit text-xs font-medium hover:text-brand"
      >
        Listen Now
      </Link>
    </article>
  );
}
