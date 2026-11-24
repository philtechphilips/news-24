import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard, CategoryTag, PostCover, SectionHeader } from "@/components/cards";
import Comments from "@/components/Comments";
import PostActions from "@/components/PostActions";
import { getBlog } from "@/lib/blog";
import { formatDate, getPost, readTime, relatedPosts } from "@/lib/content";
import { seedComments } from "@/lib/data";
import type { Block } from "@/lib/types";

export async function generateStaticParams() {
  const { posts } = await getBlog();
  // Cache Components needs at least one param; the placeholder 404s.
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const post = getPost(await getBlog(), (await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      ...(post.image && { images: [post.image] }),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blogs/[slug]">) {
  const blog = await getBlog();
  const post = getPost(blog, (await params).slug);
  if (!post) notFound();

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
          {post.category && (
            <>
              <span aria-hidden="true">/</span>
              <Link href={`/category/${post.category}`} className="hover:text-ink">
                {post.categoryName}
              </Link>
            </>
          )}
        </nav>

        <div className="mt-6">
          <CategoryTag slug={post.category} name={post.categoryName} link />
        </div>
        <h1 className="mt-5 font-display text-4xl leading-[1.1] md:text-6xl md:leading-[1.05]">
          {post.title}
        </h1>
        <p className="mt-5 text-base leading-7 text-muted md:text-lg">{post.excerpt}</p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-y border-line py-4">
          <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
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
          </dl>
        </div>
      </header>

      <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-surface">
          <PostCover post={post} preload sizes="(min-width: 1024px) 1024px, 100vw" />
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
            baseLikes={0}
            seedCommentCount={comments.length}
          />
        </div>

        <div className="mt-16">
          <Comments slug={post.slug} seed={comments} />
        </div>
      </div>

      <section className="page-shell mt-24 pb-24 md:pb-32">
        <SectionHeader title="Keep reading" href="/blogs" />
        <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {relatedPosts(blog, post).map((p) => (
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
        <h2 className="pt-6 font-display text-3xl leading-[1.15] text-ink">{block.text}</h2>
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
