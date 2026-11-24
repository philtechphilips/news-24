import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogShell from "@/components/BlogShell";
import { PostGrid, SectionHeader } from "@/components/cards";
import { getCategory, postsByCategory } from "@/lib/content";
import { categories } from "@/lib/data";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/category/[slug]">): Promise<Metadata> {
  const category = getCategory((await params).slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const category = getCategory((await params).slug);
  if (!category) notFound();
  const posts = postsByCategory(category.slug);

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
