import { cacheLife, cacheTag } from "next/cache";
import type { ApiCategory, ApiPost } from "./api-types";
import { API_URL } from "./config";
import { categoryDescriptions } from "./data";
import type { Block, Category, Post } from "./types";

/** Cache tag for everything the public site reads. Admin actions expire it on save. */
export const BLOG_TAG = "blog";

export type Blog = { posts: Post[]; categories: Category[] };

/**
 * Published posts (newest first) and categories from the API, shaped for the
 * site's components. Cached and shared by every page; it's small, so one fetch
 * of up to 100 posts covers lists, pagination, search and article pages.
 */
export async function getBlog(): Promise<Blog> {
  "use cache";
  cacheTag(BLOG_TAG);
  cacheLife("minutes");

  const [apiPosts, apiCategories] = await Promise.all([
    fetchJson<ApiPost[]>("/posts/?limit=100"),
    fetchJson<ApiCategory[]>("/categories/?limit=100"),
  ]);
  const categories = apiCategories.map(toCategory);
  const byId = new Map(apiCategories.map((c, i) => [c.id, categories[i]]));
  return {
    posts: apiPosts.map((post) => toPost(post, byId.get(post.category_id ?? ""))),
    categories,
  };
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`API returned ${res.status} for ${path}`);
  return res.json();
}

export const slugify = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function toCategory(category: ApiCategory): Category {
  return {
    slug: slugify(category.name),
    name: category.name,
    description:
      categoryDescriptions[category.name] ?? `The latest ${category.name} stories from News 24.`,
  };
}

function toPost(post: ApiPost, category: Category | undefined): Post {
  const body = parseBody(post.body);
  const firstParagraph = body.find((b) => b.type === "p")?.text ?? "";
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || firstParagraph.slice(0, 200),
    image: post.featured_image,
    imageAlt: post.title,
    category: category?.slug ?? "",
    categoryName: category?.name ?? "Story",
    date: post.created_at,
    tags: post.tags,
    body,
  };
}

/**
 * Turns the stored text into blocks. Paragraphs are separated by a blank line;
 * "## " starts a heading, "> " lines are a quote (a last "> — Name" line is the
 * credit) and "- " lines are a list.
 */
export function parseBody(text: string): Block[] {
  return text
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      const lines = chunk.split("\n").map((line) => line.trim());
      if (lines.length === 1 && lines[0].startsWith("## ")) {
        return { type: "h2", text: lines[0].slice(3).trim() };
      }
      if (lines.every((line) => line.startsWith(">"))) {
        const quote = lines.map((line) => line.replace(/^>\s?/, ""));
        const cite = quote.at(-1)?.startsWith("— ") ? quote.pop()?.slice(2) : undefined;
        return { type: "quote", text: quote.join(" "), cite };
      }
      if (lines.every((line) => /^[-*] /.test(line))) {
        return { type: "list", items: lines.map((line) => line.slice(2).trim()) };
      }
      return { type: "p", text: lines.join(" ") };
    });
}
