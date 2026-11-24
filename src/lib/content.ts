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

/** The four stories at the top of the home page: featured first, then trending. */
export const spotlightPosts = (count = 4) => {
  const picks = [...posts.filter((p) => p.featured), ...posts.filter((p) => p.trending)];
  return [...new Set(picks)].slice(0, count);
};

export const PAGE_SIZE = 9;
export const pageCount = () => Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
export const postsPage = (page: number) =>
  allPosts().slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

export type SearchItem = { slug: string; title: string; image: string; category: string };

export const searchIndex = (): SearchItem[] =>
  allPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    image: p.image,
    category: getCategory(p.category)?.name ?? "",
  }));

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
