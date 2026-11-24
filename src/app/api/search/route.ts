import type { NextRequest } from "next/server";
import type { ApiPost } from "@/lib/api-types";
import { getBlog } from "@/lib/blog";
import { API_URL } from "@/lib/config";
import type { SearchItem } from "@/lib/content";

/**
 * GET /api/search?q=… — searches published posts through the FastAPI backend
 * (title, excerpt, body and category name). The browser calls this instead of
 * the API directly, so the API address stays server-side and there's no CORS.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim().slice(0, 100) ?? "";
  if (!q) return Response.json([] satisfies SearchItem[]);

  const url = `${API_URL}/posts/?${new URLSearchParams({ q, limit: "8" })}`;
  const [res, blog] = await Promise.all([fetch(url), getBlog()]);
  if (!res.ok) {
    return Response.json({ error: "Search is unavailable right now." }, { status: 502 });
  }

  const categoryName = new Map(blog.categories.map((c) => [c.id, c.name]));
  const posts = (await res.json()) as ApiPost[];
  return Response.json(
    posts.map(
      (post): SearchItem => ({
        slug: post.slug,
        title: post.title,
        image: post.featured_image,
        category: categoryName.get(post.category_id ?? "") ?? "Story",
      }),
    ),
  );
}
