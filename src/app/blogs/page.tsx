import type { Metadata } from "next";
import { BlogCard, PageIntro } from "@/components/cards";
import PostExplorer from "@/components/PostExplorer";
import { activeCategories, allPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "News & Blogs",
  description: "Every story from News 24, from breaking news to in-depth guides.",
};

export default function BlogsPage() {
  const posts = allPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageIntro
        eyebrow="News & Blogs"
        title="Stories worth your time"
        description="Breaking news, thoughtful analysis and practical guides from our staff writers. Filter by topic or search for something specific."
      />
      <PostExplorer
        items={posts.map(({ slug, title, excerpt, category }) => ({
          slug,
          title,
          excerpt,
          category,
        }))}
        categories={activeCategories().map(({ slug, name }) => ({ slug, name }))}
        cards={Object.fromEntries(posts.map((p) => [p.slug, <BlogCard key={p.slug} post={p} />]))}
      />
    </div>
  );
}
