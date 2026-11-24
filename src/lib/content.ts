import type { Blog } from "./blog";
import { podcasts, writers } from "./data";
import type { Post } from "./types";

/** Helpers over the posts and categories fetched by getBlog(), plus the static writers and podcasts. */

export const getWriter = (slug: string) => writers.find((w) => w.slug === slug);
export const getPodcast = (slug: string) => podcasts.find((p) => p.slug === slug);

export const getPost = (blog: Blog, slug: string) => blog.posts.find((p) => p.slug === slug);
export const getCategory = (blog: Blog, slug: string) =>
  blog.categories.find((c) => c.slug === slug);

/** The newest stories lead the home page. */
export const spotlightPosts = (blog: Blog, count = 4) => blog.posts.slice(0, count);

export const PAGE_SIZE = 9;
export const pageCount = (blog: Blog) => Math.max(1, Math.ceil(blog.posts.length / PAGE_SIZE));
export const postsPage = (blog: Blog, page: number) =>
  blog.posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

export const postsByCategory = (blog: Blog, slug: string) =>
  blog.posts.filter((p) => p.category === slug);

/** Categories that have at least one post, in API order. */
export const activeCategories = (blog: Blog) =>
  blog.categories.filter((c) => blog.posts.some((p) => p.category === c.slug));

export const relatedPosts = (blog: Blog, post: Post, count = 3) => {
  const others = blog.posts.filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => post.category && p.category === post.category);
  return [...sameCategory, ...others.filter((p) => !sameCategory.includes(p))].slice(0, count);
};

export type SearchItem = { slug: string; title: string; image: string | null; category: string };

export const searchIndex = (blog: Blog): SearchItem[] =>
  blog.posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    image: p.image,
    category: p.categoryName,
  }));

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
