import type { NextRequest } from "next/server";
import { API_URL, isUuid } from "@/lib/api";

/**
 * GET /api/posts/:id/live: passes the backend's Server-Sent Events stream for
 * a post (new comments, likes, shares) straight through to the browser, so
 * the backend's address stays private. Closing the tab aborts the upstream
 * request too.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/posts/[id]/live">) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return new Response("Post not found.", { status: 404 });

  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}/posts/${id}/live`, {
      headers: { Accept: "text/event-stream" },
      signal: request.signal,
    });
  } catch {
    return new Response("Live updates are unavailable right now.", { status: 502 });
  }
  if (!upstream.ok || !upstream.body) {
    upstream.body?.cancel();
    return new Response(null, { status: upstream.status === 404 ? 404 : 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      // no-transform: compression would hold events back until a buffer fills.
      "Cache-Control": "no-cache, no-transform",
      // The same for nginx, if the site is ever served behind it.
      "X-Accel-Buffering": "no",
    },
  });
}
