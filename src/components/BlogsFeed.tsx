import { getBlog } from "@/lib/blog";
import { pageCount, postsPage } from "@/lib/content";
import BlogShell from "./BlogShell";
import { PostGrid, SectionHeader } from "./cards";
import Pagination from "./Pagination";

export default async function BlogsFeed({ page }: { page: number }) {
  const blog = await getBlog();
  const posts = postsPage(blog, page);
  return (
    <BlogShell
      title="Blogs"
      description="Breaking news, thoughtful analysis and practical guides from our staff writers. Search for something specific or pick a topic."
      activeTopic="all"
    >
      <SectionHeader title={page === 1 ? "Latest Posts" : `Posts · Page ${page}`} />
      {posts.length > 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <p className="rounded-xl bg-surface py-16 text-center text-muted">
          No stories have been published yet.
        </p>
      )}
      <Pagination current={page} total={pageCount(blog)} />
    </BlogShell>
  );
}
