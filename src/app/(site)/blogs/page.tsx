import type { Metadata } from "next";
import BlogsFeed from "@/components/BlogsFeed";

export const metadata: Metadata = {
  title: "News & Blogs",
  description: "Every story from News 24, from breaking news to in-depth guides.",
};

export default function BlogsPage() {
  return <BlogsFeed />;
}
