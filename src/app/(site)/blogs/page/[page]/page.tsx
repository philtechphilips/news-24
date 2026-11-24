import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogsFeed from "@/components/BlogsFeed";
import { getPostsPage } from "@/lib/blog";

export async function generateStaticParams() {
  // Page 1 lives at /blogs. Cache Components needs at least one param, so with a
  // single page we still list page 2, which 404s.
  const { pageCount: pages } = await getPostsPage(1);
  return Array.from({ length: Math.max(1, pages - 1) }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blogs/page/[page]">): Promise<Metadata> {
  return { title: `News & Blogs · Page ${(await params).page}` };
}

export default async function BlogsPageN({ params }: PageProps<"/blogs/page/[page]">) {
  const page = Number((await params).page);
  if (!Number.isInteger(page) || page < 2 || page > (await getPostsPage(1)).pageCount) notFound();
  return <BlogsFeed page={page} />;
}
