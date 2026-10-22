import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard, PageIntro } from "@/components/cards";
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
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageIntro eyebrow="Category" title={category.name} description={category.description}>
        <p className="mt-4 text-xs text-muted">
          {posts.length} {posts.length === 1 ? "article" : "articles"}
        </p>
      </PageIntro>

      <nav aria-label="Categories" className="border-y border-line py-5">
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0">
          {categories.map((c) => (
            <li key={c.slug} className="shrink-0">
              <Link
                href={`/category/${c.slug}`}
                aria-current={c.slug === category.slug ? "page" : undefined}
                className={`block rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  c.slug === category.slug
                    ? "border-ink bg-ink text-white"
                    : "border-line hover:border-ink"
                }`}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {posts.length > 0 ? (
        <div className="mt-10 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-lg border border-dashed border-line py-16 text-center">
          <p className="text-sm font-medium">No {category.name} stories yet</p>
          <Link href="/blogs" className="mt-3 inline-block text-xs font-medium text-brand hover:underline">
            Browse all stories
          </Link>
        </div>
      )}
    </div>
  );
}
