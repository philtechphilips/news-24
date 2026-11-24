import type { NextRequest } from "next/server";
import { API_URL, getCurrentUser, getToken, isUuid } from "@/lib/api";
import type { ApiEngagement, EngagementSnapshot } from "@/lib/api-types";

/**
 * GET /api/posts/:id/engagement: a post's comments and counts from the
 * backend, plus who is reading (so the page knows what they've liked and what
 * they may delete). The comments section loads this each time its live stream
 * connects, then keeps it current from the stream's events.
 */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/posts/[id]/engagement">) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return Response.json({ error: "Post not found." }, { status: 404 });

  const token = await getToken();
  try {
    const [res, user] = await Promise.all([
      fetch(`${API_URL}/posts/${id}/engagement`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      getCurrentUser(),
    ]);
    if (res.status === 404) return Response.json({ error: "Post not found." }, { status: 404 });
    if (!res.ok) throw new Error(`API returned ${res.status}`);

    const snapshot: EngagementSnapshot = {
      ...((await res.json()) as ApiEngagement),
      viewer: user && { id: user.id, name: user.name, isAdmin: user.role === "admin" },
    };
    return Response.json(snapshot, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return Response.json({ error: "Comments are unavailable right now." }, { status: 502 });
  }
}
