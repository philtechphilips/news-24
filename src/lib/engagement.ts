"use client";

import { useSyncExternalStore } from "react";
import type { Comment } from "./types";

/**
 * Likes, comments and replies for this browser only, saved in localStorage.
 * Swap these functions for API calls once the backend has endpoints for them.
 */

export type LocalComment = Comment & { postSlug: string };

type State = {
  name: string | null;
  likedPosts: string[];
  likedComments: string[];
  comments: LocalComment[];
  subscribedEmail: string | null;
};

const KEY = "news24:engagement:v1";

const EMPTY: State = {
  name: null,
  likedPosts: [],
  likedComments: [],
  comments: [],
  subscribedEmail: null,
};

let state: State | null = null;
const listeners = new Set<() => void>();

function load(): State {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getSnapshot() {
  if (state === null) state = load();
  return state;
}

const getServerSnapshot = () => EMPTY;

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    state = load();
    listeners.forEach((l) => l());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function update(change: (s: State) => State) {
  state = change(getSnapshot());
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode); keep the change in memory.
  }
  listeners.forEach((l) => l());
}

export const useEngagement = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

export const setName = (name: string | null) =>
  update((s) => ({ ...s, name }));

export const togglePostLike = (slug: string) =>
  update((s) => ({ ...s, likedPosts: toggle(s.likedPosts, slug) }));

export const toggleCommentLike = (id: string) =>
  update((s) => ({ ...s, likedComments: toggle(s.likedComments, id) }));

export function addComment(postSlug: string, parentId: string | null, body: string) {
  update((s) => ({
    ...s,
    comments: [
      ...s.comments,
      {
        id: `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        postSlug,
        parentId,
        author: s.name ?? "Anonymous",
        body,
        date: new Date().toISOString(),
        likes: 0,
      },
    ],
  }));
}

/** Deletes a comment and every reply under it. */
export function deleteComment(id: string) {
  update((s) => {
    const doomed = new Set([id]);
    let grew = true;
    while (grew) {
      grew = false;
      for (const c of s.comments) {
        if (c.parentId && doomed.has(c.parentId) && !doomed.has(c.id)) {
          doomed.add(c.id);
          grew = true;
        }
      }
    }
    return { ...s, comments: s.comments.filter((c) => !doomed.has(c.id)) };
  });
}

export const subscribeEmail = (email: string) =>
  update((s) => ({ ...s, subscribedEmail: email }));
