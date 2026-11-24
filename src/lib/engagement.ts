"use client";

import { useSyncExternalStore } from "react";

/**
 * The newsletter email, saved in this browser's localStorage until the
 * backend has a newsletter endpoint. (Comments, likes and shares live in the
 * backend: see use-live-post.tsx.)
 */

type State = { subscribedEmail: string | null };

const KEY = "news24:engagement:v1";

const EMPTY: State = { subscribedEmail: null };

let state: State | null = null;
const listeners = new Set<() => void>();

function load(): State {
  try {
    const raw = window.localStorage.getItem(KEY);
    const saved = raw ? JSON.parse(raw) : null;
    return { subscribedEmail: saved?.subscribedEmail ?? null };
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

export const subscribeEmail = (email: string) =>
  update((s) => ({ ...s, subscribedEmail: email }));
