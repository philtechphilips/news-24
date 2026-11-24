import { pageCount, postsPage } from "@/lib/content";
import BlogShell from "./BlogShell";
import { PostGrid, SectionHeader } from "./cards";
import Pagination from "./Pagination";

export default function BlogsFeed({ page }: { page: number }) {
  return (
    <BlogShell
      title="Blogs"
      description="Breaking news, thoughtful analysis and practical guides from our staff writers. Search for something specific or pick a topic."
      activeTopic="all"
    >
      <SectionHeader title={page === 1 ? "Latest Posts" : `Posts · Page ${page}`} />
      <PostGrid posts={postsPage(page)} />
      <Pagination current={page} total={pageCount()} />
    </BlogShell>
  );
}
