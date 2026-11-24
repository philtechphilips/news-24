import { cacheLife, cacheTag } from "next/cache";
import type { ApiCategory, ApiPodcast, ApiPost, ApiWriter } from "./api-types";
import { API_URL } from "./config";
import { categoryDescriptions } from "./data";
import type { Block, Category, Podcast, Post, Writer } from "./types";

/** Cache tag for everything the public site reads. Admin actions expire it on save. */
export const BLOG_TAG = "blog";

export type Blog = {
  posts: Post[];
  categories: Category[];
  writers: Writer[];
  podcasts: Podcast[];
};

/**
 * Everything the public site shows, from the API: published posts (newest
 * first), categories, staff writers and published podcasts, shaped for the
 * site's components. Cached and shared by every page; it's small, so one fetch
 * of up to 100 of each covers lists, pagination, search and detail pages.
 */
export async function getBlog(): Promise<Blog> {
  "use cache";
  cacheTag(BLOG_TAG);
  cacheLife("minutes");

  const [apiPosts, apiPodcasts, lookups] = await Promise.all([
    fetchJson<ApiPost[]>("/posts/?limit=100"),
    fetchJson<ApiPodcast[]>("/podcasts/?limit=100"),
    getLookups(),
  ]);
  const { categories, writers, toSitePost, writerSlugOf } = mappers(lookups);
  return {
    posts: apiPosts.map(toSitePost),
    categories,
    writers,
    podcasts: apiPodcasts.map((podcast) => toPodcast(podcast, writerSlugOf(podcast.host_id))),
  };
}

export const POSTS_PER_PAGE = 12;

export type PostsPage = { posts: Post[]; total: number; pageCount: number };

/** One page of published posts, paged by the API (limit/skip + X-Total-Count). */
export async function getPostsPage(page: number): Promise<PostsPage> {
  "use cache";
  cacheTag(BLOG_TAG);
  cacheLife("minutes");

  const params = new URLSearchParams({
    limit: String(POSTS_PER_PAGE),
    skip: String((page - 1) * POSTS_PER_PAGE),
  });
  const [res, lookups] = await Promise.all([fetch(`${API_URL}/posts/?${params}`), getLookups()]);
  if (!res.ok) throw new Error(`API returned ${res.status} for /posts/?${params}`);
  const total = Number(res.headers.get("X-Total-Count") ?? 0);
  const posts = ((await res.json()) as ApiPost[]).map(mappers(lookups).toSitePost);
  return { posts, total, pageCount: Math.max(1, Math.ceil(total / POSTS_PER_PAGE)) };
}

type Lookups = { apiCategories: ApiCategory[]; apiWriters: ApiWriter[] };

/** Categories and writers, needed to label posts. Shared by the reads above. */
async function getLookups(): Promise<Lookups> {
  "use cache";
  cacheTag(BLOG_TAG);
  cacheLife("minutes");
  const [apiCategories, apiWriters] = await Promise.all([
    fetchJson<ApiCategory[]>("/categories/?limit=100"),
    fetchJson<ApiWriter[]>("/writers/?limit=100"),
  ]);
  return { apiCategories, apiWriters };
}

function mappers({ apiCategories, apiWriters }: Lookups) {
  const categories = apiCategories.map(toCategory);
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const writerSlug = new Map(apiWriters.map((w) => [w.id, w.slug]));
  const writerSlugOf = (id: string | null) => (id && writerSlug.get(id)) || "";
  return {
    categories,
    writers: apiWriters.map(toWriter),
    writerSlugOf,
    toSitePost: (post: ApiPost) =>
      toPost(post, categoryById.get(post.category_id ?? ""), writerSlugOf(post.writer_id)),
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
    id: category.id,
    slug: slugify(category.name),
    name: category.name,
    description:
      categoryDescriptions[category.name] ?? `The latest ${category.name} stories from News 24.`,
  };
}

function toWriter(writer: ApiWriter): Writer {
  return {
    slug: writer.slug,
    name: writer.name,
    role: writer.role,
    avatar: writer.avatar,
    location: writer.location,
    joined: writer.joined,
    bio: writer.bio,
    beats: writer.beats,
    social: writer.social,
  };
}

function toPodcast(podcast: ApiPodcast, host: string): Podcast {
  const minutes = podcast.duration_minutes;
  return {
    slug: podcast.slug,
    title: podcast.title,
    description: podcast.description,
    image: podcast.cover_image,
    imageAlt: podcast.title,
    host,
    date: podcast.created_at,
    duration: !minutes
      ? ""
      : minutes < 60
        ? `${minutes} min`
        : `${Math.floor(minutes / 60)} h ${minutes % 60} min`.replace(" 0 min", ""),
    audioUrl: podcast.audio_url,
    topics: podcast.topics,
    notes: podcast.notes,
  };
}

function toPost(post: ApiPost, category: Category | undefined, writer: string): Post {
  const body = parseBody(post.body);
  const firstParagraph = body.find((b) => b.type === "p")?.text ?? "";
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || firstParagraph.slice(0, 200),
    image: post.featured_image,
    imageAlt: post.title,
    category: category?.slug ?? "",
    categoryName: category?.name ?? "Story",
    writer,
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
