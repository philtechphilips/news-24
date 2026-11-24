"use server";

import { API_URL, getToken, isUuid, toApiError } from "./api";
import type { ApiComment, ApiLikeResult, ApiPostStats, ApiUser } from "./api-types";

/** Comments, likes and shares, sent to the backend as the logged-in reader. */

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; needsLogin?: boolean };

async function call<T>(path: string, method: string, json?: unknown): Promise<ActionResult<T>> {
  const token = await getToken();
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(json !== undefined && { "Content-Type": "application/json" }),
      },
      body: json !== undefined ? JSON.stringify(json) : undefined,
    });
  } catch {
    return { ok: false, error: "We can't reach the server right now. Try again shortly." };
  }
  if (res.status === 401) {
    return { ok: false, error: "Log in to do that.", needsLogin: true };
  }
  if (!res.ok) {
    const error = await toApiError(res);
    return { ok: false, error: Object.values(error.fields)[0] ?? error.message };
  }
  return { ok: true, data: (res.status === 204 ? undefined : await res.json()) as T };
}

const notFound = { ok: false, error: "That isn't available any more." } as const;

export async function setPostLike(postId: string, liked: boolean) {
  if (!isUuid(postId)) return notFound;
  return call<ApiLikeResult>(`/posts/${postId}/like`, liked ? "PUT" : "DELETE");
}

export async function setCommentLike(commentId: string, liked: boolean) {
  if (!isUuid(commentId)) return notFound;
  return call<ApiLikeResult>(`/comments/${commentId}/like`, liked ? "PUT" : "DELETE");
}

export async function addComment(postId: string, body: string, parentId: string | null) {
  if (!isUuid(postId) || (parentId !== null && !isUuid(parentId))) return notFound;
  return call<ApiComment>(`/posts/${postId}/comments`, "POST", { body, parent_id: parentId });
}

export async function deleteComment(commentId: string) {
  if (!isUuid(commentId)) return notFound;
  return call<void>(`/comments/${commentId}`, "DELETE");
}

export async function sharePost(postId: string) {
  if (!isUuid(postId)) return notFound;
  return call<ApiPostStats>(`/posts/${postId}/share`, "POST");
}

export async function setDisplayName(name: string) {
  return call<ApiUser>("/users/me", "PATCH", { name });
}
