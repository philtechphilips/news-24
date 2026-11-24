"use client";

import { formatCount } from "@/lib/content";
import { useLivePost } from "@/lib/use-live-post";
import { CommentIcon, HeartIcon } from "./icons";
import ShareMenu from "./ShareMenu";

/** Like, comment and share counts for the article, updated live. */
export default function PostActions({ title }: { title: string }) {
  const live = useLivePost();
  const { loaded, liked, stats, viewer } = live;
  const count = (n: number) => (loaded ? formatCount(n) : "–");

  const button =
    "flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium tabular-nums transition";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={live.togglePostLike}
        disabled={!loaded}
        aria-pressed={liked}
        className={`${button} disabled:opacity-60 ${
          liked
            ? "border-brand bg-brand-soft text-brand"
            : "border-line hover:border-brand hover:text-brand"
        }`}
      >
        <HeartIcon filled={liked} size={17} />
        {count(stats.likes)}
        <span className="sr-only">
          {!viewer ? "likes. Log in to like this article" : liked ? "likes. Unlike" : "likes. Like this article"}
        </span>
      </button>
      <a href="#comments" className={`${button} border-line hover:border-ink`}>
        <CommentIcon size={17} />
        {count(live.comments.length)}
        <span className="sr-only">comments</span>
      </a>
      <ShareMenu title={title} shares={stats.shares} loaded={loaded} onShare={live.recordShare} />
    </div>
  );
}
