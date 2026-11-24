import type { NextRequest } from "next/server";
import { getPostsPage } from "@/lib/blog";

/**
 * GET /api/posts?page=N — one page of 12 published posts from the backend
 * (GET /posts/?limit=12&skip=…), shaped for the site's cards. The /blogs page
 * calls this when you change page, so it updates in place.
 */
export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  if (!Number.isInteger(page) || page < 1) {
    return Response.json({ error: "page must be a whole number from 1" }, { status: 400 });
  }
  try {
    return Response.json({ page, ...(await getPostsPage(page)) });
  } catch {
    return Response.json({ error: "Posts are unavailable right now." }, { status: 502 });
  }
}
