"use client";

import { useState } from "react";
import { formatCount } from "@/lib/content";
import { togglePostLike, useEngagement } from "@/lib/engagement";
import { CommentIcon, HeartIcon, ShareIcon } from "./icons";

export default function PostActions({
  slug,
  title,
  baseLikes,
  seedCommentCount,
}: {
  slug: string;
  title: string;
  baseLikes: number;
  seedCommentCount: number;
}) {
  const { likedPosts, comments } = useEngagement();
  const [shareLabel, setShareLabel] = useState("Share");
  const liked = likedPosts.includes(slug);
  const commentCount =
    seedCommentCount + comments.filter((c) => c.postSlug === slug).length;

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareLabel("Link copied");
    } catch {
      setShareLabel("Couldn't share");
    }
    setTimeout(() => setShareLabel("Share"), 2000);
  };

  const button =
    "flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => togglePostLike(slug)}
        aria-pressed={liked}
        className={`${button} ${
          liked
            ? "border-brand bg-brand-soft text-brand"
            : "border-line hover:border-brand hover:text-brand"
        }`}
      >
        <HeartIcon filled={liked} size={17} />
        {formatCount(baseLikes + (liked ? 1 : 0))}
        <span className="sr-only">{liked ? "Unlike this article" : "Like this article"}</span>
      </button>
      <a href="#comments" className={`${button} border-line hover:border-ink`}>
        <CommentIcon size={17} />
        {commentCount}
        <span className="sr-only">comments</span>
      </a>
      <button type="button" onClick={share} className={`${button} border-line hover:border-ink`}>
        <ShareIcon size={16} />
        <span aria-live="polite">{shareLabel}</span>
      </button>
    </div>
  );
}
