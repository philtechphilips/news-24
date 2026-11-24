import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogShell from "@/components/BlogShell";
import { PostGrid, SectionHeader } from "@/components/cards";
import { getBlog } from "@/lib/blog";
import { getCategory, postsByCategory } from "@/lib/content";

export async function generateStaticParams() {
  const { categories } = await getBlog();
  // Cache Components needs at least one param; the placeholder 404s.
  return categories.length
    ? categories.map((c) => ({ slug: c.slug }))
    : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/category/[slug]">): Promise<Metadata> {
  const category = getCategory(await getBlog(), (await params).slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const blog = await getBlog();
  const category = getCategory(blog, (await params).slug);
  if (!category) notFound();
  const posts = postsByCategory(blog, category.slug);

  return (
    <BlogShell title={category.name} description={category.description} activeTopic={category.slug}>
      <SectionHeader title={`${posts.length} ${posts.length === 1 ? "story" : "stories"}`} />
      {posts.length > 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <div className="rounded-xl bg-surface py-16 text-center">
          <p className="font-display text-xl">No {category.name} stories yet</p>
          <Link
            href="/blogs"
            className="mt-5 inline-flex rounded-full border border-ink px-5 py-2.5 text-sm font-medium hover:bg-ink hover:text-white"
          >
            Browse all stories
          </Link>
        </div>
      )}
    </BlogShell>
  );
}
