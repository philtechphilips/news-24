"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, use, useEffect, useReducer, useState } from "react";
import type { ApiComment, ApiPostStats, EngagementSnapshot, Viewer } from "./api-types";
import * as actions from "./engagement-actions";

/**
 * Live comments, likes and shares for one post.
 *
 * The provider opens one Server-Sent Events stream (/api/posts/:id/live).
 * Each time it connects (and after any drop) it loads the full snapshot from
 * /api/posts/:id/engagement, then applies the stream's events as other
 * readers comment, like and share. Your own likes show instantly and are
 * rolled back if the server refuses them.
 */

export type LiveStatus = "connecting" | "live" | "reconnecting";

/** `fresh`: arrived from another reader while the page was open. */
export type LiveComment = ApiComment & { fresh?: boolean };

type State = {
  loaded: boolean;
  loadFailed: boolean;
  status: LiveStatus;
  viewer: Viewer | null;
  stats: ApiPostStats;
  comments: LiveComment[];
  liked: boolean;
  likedComments: string[];
};

type Change =
  | { type: "snapshot"; snapshot: EngagementSnapshot }
  | { type: "load_failed" }
  | { type: "status"; status: LiveStatus }
  | { type: "stats"; stats: ApiPostStats }
  | { type: "comment"; comment: ApiComment; fresh: boolean }
  | { type: "removed"; ids: string[] }
  // `userId` is set for events from the stream: the liked flag only changes
  // when it's this reader (liking from another tab).
  | { type: "post_liked"; liked: boolean; likes?: number; userId?: string }
  | { type: "comment_liked"; commentId: string; likes: number; liked?: boolean; userId?: string }
  | { type: "renamed"; name: string };

const initialState: State = {
  loaded: false,
  loadFailed: false,
  status: "connecting",
  viewer: null,
  stats: { likes: 0, comments: 0, shares: 0 },
  comments: [],
  liked: false,
  likedComments: [],
};

const isMe = (state: State, userId?: string) =>
  userId === undefined || userId === state.viewer?.id;

function reducer(state: State, change: Change): State {
  switch (change.type) {
    case "snapshot": {
      const { viewer, stats, comments, liked, liked_comments } = change.snapshot;
      return {
        ...state,
        loaded: true,
        loadFailed: false,
        viewer,
        stats,
        comments,
        liked,
        likedComments: liked_comments,
      };
    }
    case "load_failed":
      return { ...state, loadFailed: true };
    case "status":
      return { ...state, status: change.status };
    case "stats":
      return { ...state, stats: change.stats };
    case "comment": {
      const { comment } = change;
      if (state.comments.some((c) => c.id === comment.id)) return state;
      const fresh = change.fresh && comment.author.id !== state.viewer?.id;
      return { ...state, comments: [...state.comments, { ...comment, fresh }] };
    }
    case "removed": {
      const gone = new Set(change.ids);
      return {
        ...state,
        comments: state.comments.filter((c) => !gone.has(c.id)),
        likedComments: state.likedComments.filter((id) => !gone.has(id)),
      };
    }
    case "post_liked":
      return {
        ...state,
        liked: isMe(state, change.userId) ? change.liked : state.liked,
        stats: change.likes === undefined ? state.stats : { ...state.stats, likes: change.likes },
      };
    case "comment_liked": {
      const { commentId, liked } = change;
      const others = state.likedComments.filter((id) => id !== commentId);
      return {
        ...state,
        comments: state.comments.map((c) =>
          c.id === commentId ? { ...c, likes: change.likes } : c,
        ),
        likedComments:
          liked === undefined || !isMe(state, change.userId)
            ? state.likedComments
            : liked
              ? [...others, commentId]
              : others,
      };
    }
    case "renamed": {
      if (!state.viewer) return state;
      const viewer = { ...state.viewer, name: change.name };
      return {
        ...state,
        viewer,
        comments: state.comments.map((c) =>
          c.author.id === viewer.id ? { ...c, author: { ...c.author, name: change.name } } : c,
        ),
      };
    }
  }
}

/** A comment's id plus the ids of every reply under it. */
export function threadIds(comments: ApiComment[], id: string): string[] {
  const ids = [id];
  for (let i = 0; i < ids.length; i++) {
    for (const c of comments) if (c.parent_id === ids[i]) ids.push(c.id);
  }
  return ids;
}

const RETRY_MS = 5000;

function useLiveStream(postId: string, dispatch: (change: Change) => void) {
  useEffect(() => {
    let source: EventSource | null = null;
    let loading: AbortController | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let reloadTimer: ReturnType<typeof setTimeout> | undefined;
    let loaded = false;

    async function load() {
      clearTimeout(reloadTimer);
      loading?.abort();
      const controller = (loading = new AbortController());
      try {
        const res = await fetch(`/api/posts/${postId}/engagement`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Engagement request failed (${res.status})`);
        dispatch({ type: "snapshot", snapshot: await res.json() });
        loaded = true;
      } catch {
        if (controller.signal.aborted) return;
        dispatch({ type: "load_failed" });
        reloadTimer = setTimeout(load, RETRY_MS);
      }
    }

    function connect() {
      const es = (source = new EventSource(`/api/posts/${postId}/live`));
      const on = <T,>(event: string, handle: (data: T) => void) =>
        es.addEventListener(event, (e) => handle(JSON.parse((e as MessageEvent<string>).data)));

      on("ready", () => {
        dispatch({ type: "status", status: "live" });
        load(); // Catch up on anything missed while disconnected.
      });
      on<ApiComment>("comment", (comment) => dispatch({ type: "comment", comment, fresh: true }));
      on<{ ids: string[] }>("comment_removed", ({ ids }) => dispatch({ type: "removed", ids }));
      on<ApiPostStats>("stats", (stats) => dispatch({ type: "stats", stats }));
      on<{ user_id: string; liked: boolean }>("post_like", (e) =>
        dispatch({ type: "post_liked", liked: e.liked, userId: e.user_id }),
      );
      on<{ comment_id: string; likes: number; user_id: string; liked: boolean }>(
        "comment_like",
        (e) =>
          dispatch({
            type: "comment_liked",
            commentId: e.comment_id,
            likes: e.likes,
            liked: e.liked,
            userId: e.user_id,
          }),
      );

      es.onerror = () => {
        dispatch({ type: "status", status: "reconnecting" });
        // Show the comments even while live updates are down.
        if (!loaded) load();
        // The browser retries dropped connections itself, but gives up on an
        // error response (e.g. the backend is down), so retry those here.
        if (es.readyState === EventSource.CLOSED) {
          reconnectTimer = setTimeout(connect, RETRY_MS);
        }
      };
    }

    connect();
    return () => {
      clearTimeout(reconnectTimer);
      clearTimeout(reloadTimer);
      loading?.abort();
      source?.close();
    };
  }, [postId, dispatch]);
}

type LivePost = State & {
  /** Log in, then come back to the comments. */
  loginHref: string;
  signupHref: string;
  togglePostLike: () => void;
  toggleCommentLike: (commentId: string) => void;
  /** These resolve to an error message, or null when it worked. */
  addComment: (body: string, parentId: string | null) => Promise<string | null>;
  deleteComment: (commentId: string) => Promise<string | null>;
  setName: (name: string) => Promise<string | null>;
  recordShare: () => void;
};

const LivePostContext = createContext<LivePost | null>(null);

export function useLivePost(): LivePost {
  const live = use(LivePostContext);
  if (!live) throw new Error("useLivePost must be used inside <LivePostProvider>");
  return live;
}

export function LivePostProvider({
  postId,
  children,
}: {
  postId: string;
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [notice, setNotice] = useState<string | null>(null);
  const router = useRouter();
  const next = encodeURIComponent(`${usePathname()}#comments`);
  const loginHref = `/login?next=${next}`;
  const signupHref = `/signup?next=${next}`;

  useLiveStream(postId, dispatch);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  /** True when the reader has to log in first (and sends them there). */
  function needsLogin(result?: { ok: boolean; needsLogin?: boolean }) {
    if (state.viewer && !result?.needsLogin) return false;
    router.push(loginHref);
    return true;
  }

  const live: LivePost = {
    ...state,
    loginHref,
    signupHref,

    async togglePostLike() {
      if (needsLogin()) return;
      const before = { liked: state.liked, likes: state.stats.likes };
      const liked = !before.liked;
      dispatch({ type: "post_liked", liked, likes: before.likes + (liked ? 1 : -1) });
      const result = await actions.setPostLike(postId, liked);
      if (result.ok) return dispatch({ type: "post_liked", ...result.data });
      dispatch({ type: "post_liked", ...before });
      if (!needsLogin(result)) setNotice(`Couldn't save your like. ${result.error}`);
    },

    async toggleCommentLike(commentId) {
      if (needsLogin()) return;
      const comment = state.comments.find((c) => c.id === commentId);
      if (!comment) return;
      const before = { liked: state.likedComments.includes(commentId), likes: comment.likes };
      const liked = !before.liked;
      dispatch({
        type: "comment_liked",
        commentId,
        liked,
        likes: before.likes + (liked ? 1 : -1),
      });
      const result = await actions.setCommentLike(commentId, liked);
      if (result.ok) return dispatch({ type: "comment_liked", commentId, ...result.data });
      dispatch({ type: "comment_liked", commentId, ...before });
      if (!needsLogin(result)) setNotice(`Couldn't save your like. ${result.error}`);
    },

    async addComment(body, parentId) {
      const result = await actions.addComment(postId, body, parentId);
      if (!result.ok) return needsLogin(result) ? null : result.error;
      dispatch({ type: "comment", comment: result.data, fresh: false });
      return null;
    },

    async deleteComment(commentId) {
      const result = await actions.deleteComment(commentId);
      if (!result.ok) return needsLogin(result) ? null : result.error;
      dispatch({ type: "removed", ids: threadIds(state.comments, commentId) });
      return null;
    },

    async setName(name) {
      const result = await actions.setDisplayName(name);
      if (!result.ok) return needsLogin(result) ? null : result.error;
      dispatch({ type: "renamed", name: result.data.name ?? name });
      return null;
    },

    async recordShare() {
      const result = await actions.sharePost(postId);
      if (result.ok) dispatch({ type: "stats", stats: result.data });
    },
  };

  return (
    <LivePostContext value={live}>
      {children}
      <p
        role="status"
        className={`fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-lg bg-ink px-4 py-3 text-sm text-white shadow-lg transition-opacity sm:inset-x-auto sm:right-6 sm:bottom-6 ${
          notice ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {notice}
      </p>
    </LivePostContext>
  );
}
