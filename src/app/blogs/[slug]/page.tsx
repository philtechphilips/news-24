import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard, CategoryTag, SectionHeader } from "@/components/cards";
import Comments from "@/components/Comments";
import PostActions from "@/components/PostActions";
import {
  formatCount,
  formatDate,
  getCategory,
  getPost,
  getWriter,
  readTime,
  relatedPosts,
} from "@/lib/content";
import { posts, seedComments } from "@/lib/data";
import type { Block } from "@/lib/types";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.image] },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blogs/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const writer = getWriter(post.writer);
  const category = getCategory(post.category);
  const comments = seedComments[post.slug] ?? [];

  return (
    <article>
      <header className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 md:pt-14">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/blogs" className="hover:text-ink">
            Blogs
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={`/category/${post.category}`} className="hover:text-ink">
            {category?.name}
          </Link>
        </nav>

        <div className="mt-6">
          <CategoryTag slug={post.category} link />
        </div>
        <h1 className="mt-4 text-3xl leading-tight font-semibold tracking-tight md:text-5xl md:leading-[1.1]">
          {post.title}
        </h1>
        <p className="mt-5 text-base leading-7 text-muted md:text-lg">{post.excerpt}</p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-y border-line py-4">
          {writer && (
            <Link href={`/writers/${writer.slug}`} className="group flex items-center gap-3">
              <span className="relative size-10 overflow-hidden rounded-full bg-surface">
                <Image src={writer.avatar} alt="" fill sizes="40px" className="object-cover" />
              </span>
              <span>
                <span className="block text-sm font-medium group-hover:text-brand">
                  {writer.name}
                </span>
                <span className="block text-xs text-muted">{writer.role}</span>
              </span>
            </Link>
          )}
          <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted sm:ml-auto">
            <div>
              <dt className="sr-only">Published</dt>
              <dd>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Reading time</dt>
              <dd>{readTime(post)}</dd>
            </div>
            <div>
              <dt className="sr-only">Views</dt>
              <dd>{formatCount(post.views)} views</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-surface">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            preload
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mt-12 space-y-6">
          {post.body.map((block, i) => (
            <BodyBlock key={i} block={block} />
          ))}
        </div>

        <div className="mt-12 border-y border-line py-6">
          <PostActions
            slug={post.slug}
            title={post.title}
            baseLikes={post.likes}
            seedCommentCount={comments.length}
          />
        </div>

        {writer && (
          <aside className="mt-10 flex flex-col gap-5 rounded-xl bg-surface p-6 sm:flex-row">
            <Link
              href={`/writers/${writer.slug}`}
              className="relative size-20 shrink-0 overflow-hidden rounded-full bg-white"
            >
              <Image src={writer.avatar} alt={`Portrait of ${writer.name}`} fill sizes="80px" className="object-cover" />
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Written by
              </p>
              <p className="mt-1 text-lg font-medium">{writer.name}</p>
              <p className="text-xs text-muted">{writer.role}</p>
              <p className="mt-3 text-sm leading-6 text-neutral-700">{writer.bio[0]}</p>
              <Link
                href={`/writers/${writer.slug}`}
                className="mt-4 inline-block text-xs font-medium text-brand hover:underline"
              >
                More from {writer.name.split(" ")[0]} →
              </Link>
            </div>
          </aside>
        )}

        <div className="mt-16">
          <Comments slug={post.slug} seed={comments} />
        </div>
      </div>

      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <SectionHeader title="Keep reading" href="/blogs" />
        <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {relatedPosts(post).map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
    </article>
  );
}

function BodyBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="text-[17px] leading-8 text-neutral-700">{block.text}</p>;
    case "h2":
      return (
        <h2 className="pt-6 text-2xl font-semibold tracking-tight text-ink">{block.text}</h2>
      );
    case "quote":
      return (
        <blockquote className="my-10 border-l-4 border-brand py-1 pl-6">
          <p className="text-xl leading-9 font-medium text-ink md:text-2xl md:leading-10">
            “{block.text}”
          </p>
          {block.cite && <footer className="mt-3 text-sm text-muted">— {block.cite}</footer>}
        </blockquote>
      );
    case "list":
      return (
        <ul className="space-y-3 pl-1">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[17px] leading-7 text-neutral-700">
              <span className="mt-2.5 size-2 shrink-0 bg-brand" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      );
  }
}
