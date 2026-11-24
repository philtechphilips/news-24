import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogsFeed from "@/components/BlogsFeed";
import { pageCount } from "@/lib/content";

export function generateStaticParams() {
  // Page 1 lives at /blogs.
  return Array.from({ length: pageCount() - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blogs/page/[page]">): Promise<Metadata> {
  return { title: `News & Blogs · Page ${(await params).page}` };
}

export default async function BlogsPageN({ params }: PageProps<"/blogs/page/[page]">) {
  const page = Number((await params).page);
  if (!Number.isInteger(page) || page < 2 || page > pageCount()) notFound();
  return <BlogsFeed page={page} />;
}
