import { getPostsPage } from "@/lib/blog";
import BlogShell from "./BlogShell";
import { SectionHeader } from "./cards";
import PagedPosts from "./PagedPosts";

/** /blogs: page 1 renders with the page; other pages load from the API in place. */
export default async function BlogsFeed() {
  return (
    <BlogShell
      title="Blogs"
      description="Breaking news, thoughtful analysis and practical guides from our staff writers. Search for something specific or pick a topic."
      activeTopic="all"
    >
      <SectionHeader title="Latest Posts" />
      <PagedPosts initial={await getPostsPage(1)} />
    </BlogShell>
  );
}
