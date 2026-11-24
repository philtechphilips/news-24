"use client";

import { useRef, useState } from "react";
import type { PostsPage } from "@/lib/blog";
import { PostGrid } from "./cards";
import Pagination from "./Pagination";

/**
 * The /blogs post grid. Starts with page 1 from the server; changing page
 * fetches that page from /api/posts (which asks the backend) and swaps the
 * posts in place, without leaving /blogs.
 */
export default function PagedPosts({ initial }: { initial: PostsPage }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const request = useRef<AbortController | null>(null);
  const top = useRef<HTMLDivElement>(null);

  async function goTo(next: number) {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setStatus("loading");
    try {
      const res = await fetch(`/api/posts?page=${next}`, { signal: controller.signal });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setData(await res.json());
      setPage(next);
      setStatus("idle");
      top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      if (!controller.signal.aborted) setStatus("error");
    }
  }

  return (
    <div ref={top} className="scroll-mt-28">
      <p className="sr-only" aria-live="polite">
        {status === "loading" ? "Loading posts…" : `Page ${page} of ${data.pageCount}`}
      </p>
      {data.posts.length > 0 ? (
        <div
          aria-busy={status === "loading"}
          className={`transition-opacity ${status === "loading" ? "opacity-50" : ""}`}
        >
          <PostGrid posts={data.posts} />
        </div>
      ) : (
        <p className="rounded-xl bg-surface py-16 text-center text-muted">
          No stories have been published yet.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="mt-6 text-sm text-brand">
          Couldn&apos;t load that page. Check your connection and try again.
        </p>
      )}
      <Pagination
        current={page}
        total={data.pageCount}
        onChange={goTo}
        disabled={status === "loading"}
      />
    </div>
  );
}
