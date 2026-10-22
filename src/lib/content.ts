import { categories, podcasts, posts, writers } from "./data";
import type { Post } from "./types";

const byNewest = (a: Post, b: Post) => b.date.localeCompare(a.date);

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const getWriter = (slug: string) => writers.find((w) => w.slug === slug);
export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);
export const getPodcast = (slug: string) =>
  podcasts.find((p) => p.slug === slug);

export const allPosts = () => [...posts].sort(byNewest);
export const featuredPosts = () => posts.filter((p) => p.featured);
export const trendingPosts = () => posts.filter((p) => p.trending);

/** Newest news stories, leaving out the featured hero stories and the design blog. */
export const latestNews = (count = 4) =>
  allPosts()
    .filter((p) => !p.featured && !p.trending && p.category !== "design")
    .slice(0, count);

/** Most-read guides from the Design blog. */
export const popularBlogs = (count = 6) =>
  posts
    .filter((p) => p.category === "design")
    .sort((a, b) => b.views - a.views)
    .slice(0, count);

export const postsByWriter = (slug: string) =>
  allPosts().filter((p) => p.writer === slug);

export const postsByCategory = (slug: string) =>
  allPosts().filter((p) => p.category === slug);

/** Categories that have at least one post, in display order. */
export const activeCategories = () =>
  categories.filter((c) => posts.some((p) => p.category === c.slug));

export const relatedPosts = (post: Post, count = 3) => {
  const sameCategory = postsByCategory(post.category).filter(
    (p) => p.slug !== post.slug,
  );
  const others = allPosts().filter(
    (p) => p.slug !== post.slug && p.category !== post.category,
  );
  return [...sameCategory, ...others].slice(0, count);
};

export function readTime(post: Post) {
  const words = post.body
    .map((b) => (b.type === "list" ? b.items.join(" ") : b.text))
    .join(" ")
    .split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export const formatDate = (iso: string) => dateFormat.format(new Date(iso));

export const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);
