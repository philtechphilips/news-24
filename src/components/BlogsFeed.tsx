import { getPostsPage } from "@/lib/blog";
import BlogShell from "./BlogShell";
import { PostGrid, SectionHeader } from "./cards";
import Pagination from "./Pagination";

/** /blogs and /blogs/page/[page]: one page of 12 posts, paged by the API. */
export default async function BlogsFeed({ page }: { page: number }) {
  const { posts, pageCount } = await getPostsPage(page);
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
      <Pagination current={page} total={pageCount} />
    </BlogShell>
  );
}
