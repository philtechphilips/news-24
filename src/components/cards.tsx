import Image from "next/image";
import Link from "next/link";
import { formatDate, getCategory, postsByWriter, readTime } from "@/lib/content";
import type { Podcast, Post, Writer } from "@/lib/types";
import { CornerDownRightIcon, MicIcon } from "./icons";

export function CategoryTag({ slug, link = false }: { slug: string; link?: boolean }) {
  const category = getCategory(slug);
  if (!category) return null;
  const className =
    "inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-ink";
  return link ? (
    <Link href={`/category/${category.slug}`} className={`${className} hover:bg-brand-light`}>
      {category.name}
    </Link>
  ) : (
    <span className={className}>{category.name}</span>
  );
}

/** "Economy — 4 min read" line shown above every card title. */
function CardLabel({ label, meta, tone }: { label: string; meta?: string; tone: string }) {
  return (
    <p className="space-x-2 text-sm font-medium">
      <span className={tone}>{label}</span>
      {meta && (
        <>
          <span className="opacity-20">—</span>
          <span className="opacity-80">{meta}</span>
        </>
      )}
    </p>
  );
}

/** Arrow + "Read more" with an underline that slides in on card hover. */
function ReadMore({ label = "Read more", className = "" }: { label?: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-flex items-start gap-1.5 transition-colors duration-300 ${className}`}>
      <CornerDownRightIcon size={13} strokeWidth={2} className="mt-0.5 shrink-0" />
      <span className="relative overflow-hidden pb-1.5 text-[15px] font-medium leading-none">
        {label}
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-current opacity-20" />
        <span className="absolute inset-x-0 bottom-0 h-0.5 -translate-x-full bg-current transition-transform duration-300 ease-in-out group-hover:translate-x-0" />
      </span>
    </span>
  );
}

/** Stretches a title link over its whole card so the card is one click target. */
const stretchedLink = "after:absolute after:inset-0 after:content-['']";

/**
 * A 12px quarter-circle filler that rounds the outside corner where a notch meets
 * a card edge. `at` is the corner the curve is centred on.
 */
const outerCorner = (at: "top left" | "bottom right", color: string) => ({
  background: `radial-gradient(circle at ${at}, transparent 11.5px, ${color} 12px)`,
});

/** Tab cut out of a card's bottom-right corner. `color` must match what's behind the card. */
function NotchBottomRight({ color = "#fff" }: { color?: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-0 bottom-0 z-10 h-8 w-16 rounded-tl-xl"
      style={{ background: color }}
    >
      <span className="absolute right-0 bottom-full size-3" style={outerCorner("top left", color)} />
      <span className="absolute right-full bottom-0 size-3" style={outerCorner("top left", color)} />
    </span>
  );
}

/** Tab cut out of an image's top-left corner, filled with the card colour around it. */
function NotchTopLeft({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 z-10 h-8 w-20 rounded-br-xl md:w-36"
      style={{ background: color }}
    >
      <span className="absolute top-0 left-full size-3" style={outerCorner("bottom right", color)} />
      <span className="absolute top-full left-0 size-3" style={outerCorner("bottom right", color)} />
    </span>
  );
}

export function SectionHeader({
  title,
  href,
  linkLabel = "View all",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 md:mb-8">
      <h2 className="font-display text-2xl leading-[1.1] md:text-[1.75rem]">{title}</h2>
      {href && (
        <Link href={href} className="group relative shrink-0 text-ink hover:text-brand">
          <ReadMore label={linkLabel} />
          <span className="sr-only">{linkLabel}</span>
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
    <div className="mb-10 border-b border-ink/10 pt-10 pb-10 md:mb-14 md:pt-16 md:pb-14">
      <p className="text-sm font-medium text-brand-ink">{eyebrow}</p>
      <h1 className="mt-3 max-w-4xl font-display text-4xl leading-[1.05] md:text-6xl">{title}</h1>
      {description && (
        <p className="mt-5 max-w-2xl text-base leading-7 text-ink/75 md:text-lg">{description}</p>
      )}
      {children}
    </div>
  );
}

/** Large deep-coral card that leads the spotlight block. */
export function SpotlightLead({ post }: { post: Post }) {
  const category = getCategory(post.category);
  return (
    <article className="group relative">
      <div className="overflow-hidden rounded-xl bg-brand-deep px-6 pt-6 text-white md:px-16 md:pt-12">
        <div className="max-w-2xl space-y-4 md:space-y-6">
          <CardLabel label={category?.name ?? "Story"} meta={readTime(post)} tone="text-brand-light" />
          <h2 className="font-display text-3xl leading-[1.1] md:text-5xl">
            <Link href={`/blogs/${post.slug}`} className={stretchedLink}>
              {post.title}
            </Link>
          </h2>
          <ReadMore className="text-white group-hover:text-brand-light" />
        </div>
        <div className="relative mt-6 aspect-214/85 translate-y-2 overflow-hidden rounded-tr-xl bg-white/10 transition-transform duration-700 group-hover:translate-y-0 md:mt-10">
          <NotchTopLeft color="var(--color-brand-deep)" />
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            preload
            sizes="(min-width: 768px) 75vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </article>
  );
}

/** Pastel text-only card that sits under the lead story. */
export function SpotlightCard({ post }: { post: Post }) {
  const category = getCategory(post.category);
  return (
    <article className="group relative flex h-full flex-col rounded-xl bg-brand-soft p-6 text-ink lg:px-8 lg:py-10">
      <CardLabel label={category?.name ?? "Story"} meta={readTime(post)} tone="text-brand-ink" />
      <h3 className="mt-6 mb-6 text-lg leading-snug font-medium tracking-[-0.01em] md:mt-12">
        <Link href={`/blogs/${post.slug}`} className={stretchedLink}>
          {post.title}
        </Link>
      </h3>
      <ReadMore className="mt-auto group-hover:text-brand" />
      <NotchBottomRight />
    </article>
  );
}

export function BlogCard({ post }: { post: Post }) {
  const category = getCategory(post.category);
  return (
    <article className="group relative flex flex-col">
      <div className="relative mb-5 aspect-312/163 overflow-hidden rounded-md bg-surface">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <CardLabel label={category?.name ?? "Story"} meta={readTime(post)} tone="text-brand-ink" />
      <h3 className="mt-3 text-lg leading-snug font-medium tracking-[-0.01em] group-hover:text-brand-ink">
        <Link href={`/blogs/${post.slug}`} className={stretchedLink}>
          {post.title}
        </Link>
      </h3>
      <time dateTime={post.date} className="mt-2 text-sm text-muted">
        {formatDate(post.date)}
      </time>
    </article>
  );
}

export function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <ul className="grid gap-y-10 md:grid-cols-2 md:gap-x-6 md:gap-y-13 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <BlogCard post={post} />
        </li>
      ))}
    </ul>
  );
}

export function WriterCard({ writer, showCount = false }: { writer: Writer; showCount?: boolean }) {
  const count = postsByWriter(writer.slug).length;
  return (
    <Link href={`/writers/${writer.slug}`} className="group block">
      <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-surface">
        <Image
          src={writer.avatar}
          alt={`Portrait of ${writer.name}`}
          fill
          sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <p className="mt-4 text-base font-medium group-hover:text-brand-ink">{writer.name}</p>
      <p className="text-sm text-muted">
        {writer.role}
        {showCount && ` · ${count} ${count === 1 ? "article" : "articles"}`}
      </p>
    </Link>
  );
}

export function PodcastCard({ podcast }: { podcast: Podcast }) {
  return (
    <article className="group relative flex flex-col">
      <div className="relative mb-5 aspect-312/163 overflow-hidden rounded-md bg-night">
        <Image
          src={podcast.image}
          alt={podcast.imageAlt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
          className="object-cover opacity-85 transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-12 place-items-center rounded-full bg-white/90 text-brand-deep backdrop-blur-sm transition group-hover:bg-white">
            <MicIcon size={20} />
          </span>
        </span>
      </div>
      <CardLabel label="Podcast" meta={podcast.duration} tone="text-brand-ink" />
      <h3 className="mt-3 text-lg leading-snug font-medium tracking-[-0.01em] group-hover:text-brand-ink">
        <Link href={`/podcasts/${podcast.slug}`} className={stretchedLink}>
          {podcast.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{podcast.description}</p>
    </article>
  );
}
