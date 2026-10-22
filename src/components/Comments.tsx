"use client";

import { useState } from "react";
import { formatDate } from "@/lib/content";
import {
  addComment,
  deleteComment,
  setName,
  toggleCommentLike,
  useEngagement,
} from "@/lib/engagement";
import type { Comment } from "@/lib/types";
import { HeartIcon, ReplyIcon, TrashIcon } from "./icons";

type Thread = Comment & { mine: boolean };
type SortOrder = "top" | "newest";

const MAX_INDENT = 3;
const avatarColors = ["bg-brand", "bg-blue-600", "bg-green-600", "bg-amber-500", "bg-purple-600", "bg-teal-600"];

function avatarColor(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function Comments({ slug, seed }: { slug: string; seed: Comment[] }) {
  const { comments, likedComments } = useEngagement();
  const [sort, setSort] = useState<SortOrder>("top");

  const all: Thread[] = [
    ...seed.map((c) => ({ ...c, mine: false })),
    ...comments.filter((c) => c.postSlug === slug).map((c) => ({ ...c, mine: true })),
  ];

  const likesOf = (c: Thread) => c.likes + (likedComments.includes(c.id) ? 1 : 0);
  const sorter =
    sort === "top"
      ? (a: Thread, b: Thread) => likesOf(b) - likesOf(a) || b.date.localeCompare(a.date)
      : (a: Thread, b: Thread) => b.date.localeCompare(a.date);

  const childrenOf = (parentId: string | null) =>
    all
      .filter((c) => c.parentId === parentId)
      // Replies read top to bottom in the order they were written.
      .sort(parentId === null ? sorter : (a, b) => a.date.localeCompare(b.date));

  return (
    <section id="comments" aria-labelledby="comments-heading" className="scroll-mt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 id="comments-heading" className="text-2xl font-medium tracking-tight">
          Comments <span className="text-muted">({all.length})</span>
        </h2>
        {all.length > 1 && (
          <div className="flex rounded-full border border-line p-0.5 text-xs" role="group" aria-label="Sort comments">
            {(["top", "newest"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSort(option)}
                aria-pressed={sort === option}
                className={`rounded-full px-3 py-1 font-medium capitalize transition ${
                  sort === option ? "bg-ink text-white" : "text-muted hover:text-ink"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <CommentForm
          submitLabel="Post comment"
          placeholder="Share your thoughts on this story…"
          onSubmit={(body) => addComment(slug, null, body)}
        />
      </div>

      {all.length === 0 ? (
        <p className="mt-10 rounded-lg bg-surface py-10 text-center text-sm text-muted">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ul className="mt-10 space-y-8">
          {childrenOf(null).map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              depth={0}
              slug={slug}
              childrenOf={childrenOf}
              likesOf={likesOf}
              likedComments={likedComments}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function CommentItem({
  comment,
  depth,
  slug,
  childrenOf,
  likesOf,
  likedComments,
  replyingTo,
}: {
  comment: Thread;
  depth: number;
  slug: string;
  childrenOf: (id: string) => Thread[];
  likesOf: (c: Thread) => number;
  likedComments: string[];
  replyingTo?: string;
}) {
  const [replying, setReplying] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const replies = childrenOf(comment.id);
  const liked = likedComments.includes(comment.id);

  return (
    <li>
      <article className="flex gap-3">
        <span
          aria-hidden="true"
          className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white ${avatarColor(comment.author)}`}
        >
          {initials(comment.author)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-medium">{comment.author}</span>
            {comment.mine && (
              <span className="rounded-sm bg-brand-soft px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                You
              </span>
            )}
            <time dateTime={comment.date} className="text-xs text-muted">
              {formatDate(comment.date)}
            </time>
          </div>
          <p className="mt-1.5 text-sm leading-6 break-words whitespace-pre-wrap text-neutral-700">
            {replyingTo && <span className="font-medium text-brand">@{replyingTo} </span>}
            {comment.body}
          </p>

          <div className="mt-2 flex items-center gap-1 text-xs text-muted">
            <button
              type="button"
              onClick={() => toggleCommentLike(comment.id)}
              aria-pressed={liked}
              aria-label={liked ? "Unlike comment" : "Like comment"}
              className={`flex items-center gap-1.5 rounded-full px-2 py-1 transition hover:bg-surface ${
                liked ? "text-brand" : "hover:text-ink"
              }`}
            >
              <HeartIcon filled={liked} size={14} />
              {likesOf(comment)}
            </button>
            <button
              type="button"
              onClick={() => setReplying((r) => !r)}
              aria-expanded={replying}
              className="flex items-center gap-1.5 rounded-full px-2 py-1 transition hover:bg-surface hover:text-ink"
            >
              <ReplyIcon size={14} /> Reply
            </button>
            {comment.mine &&
              (confirmingDelete ? (
                <span className="flex items-center gap-1 pl-1">
                  <span>Delete{replies.length > 0 ? " with replies" : ""}?</span>
                  <button
                    type="button"
                    onClick={() => deleteComment(comment.id)}
                    className="rounded-full px-2 py-1 font-medium text-brand hover:bg-brand-soft"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="rounded-full px-2 py-1 hover:bg-surface hover:text-ink"
                  >
                    No
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="flex items-center gap-1.5 rounded-full px-2 py-1 transition hover:bg-surface hover:text-brand"
                >
                  <TrashIcon size={14} /> Delete
                </button>
              ))}
          </div>

          {replying && (
            <div className="mt-3">
              <CommentForm
                autoFocus
                compact
                submitLabel="Reply"
                placeholder={`Reply to ${comment.author}…`}
                onCancel={() => setReplying(false)}
                onSubmit={(body) => {
                  addComment(slug, comment.id, body);
                  setReplying(false);
                }}
              />
            </div>
          )}
        </div>
      </article>

      {replies.length > 0 && (
        <ul
          className={`mt-5 space-y-5 ${
            depth < MAX_INDENT ? "ml-4 border-l-2 border-line pl-4 sm:ml-4.5 sm:pl-6" : ""
          }`}
        >
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              slug={slug}
              childrenOf={childrenOf}
              likesOf={likesOf}
              likedComments={likedComments}
              // Past the indent limit, mention who is being replied to instead.
              replyingTo={depth + 1 > MAX_INDENT ? comment.author : undefined}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function CommentForm({
  onSubmit,
  onCancel,
  submitLabel,
  placeholder,
  autoFocus = false,
  compact = false,
}: {
  onSubmit: (body: string) => void;
  onCancel?: () => void;
  submitLabel: string;
  placeholder: string;
  autoFocus?: boolean;
  compact?: boolean;
}) {
  const { name } = useEngagement();
  const [draftName, setDraftName] = useState("");
  const [body, setBody] = useState("");
  const [editingName, setEditingName] = useState(false);

  const needsName = !name || editingName;
  const canSubmit = body.trim() !== "" && (!needsName || draftName.trim() !== "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (needsName) {
      setName(draftName.trim());
      setEditingName(false);
    }
    onSubmit(body.trim());
    setBody("");
  };

  return (
    <form
      onSubmit={submit}
      className={`rounded-lg border border-line bg-white focus-within:border-ink ${compact ? "p-3" : "p-4"}`}
    >
      {needsName ? (
        <label className="mb-3 block">
          <span className="sr-only">Your name</span>
          <input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder="Your name"
            maxLength={40}
            required
            autoFocus={autoFocus}
            className="h-9 w-full rounded-md bg-surface px-3 text-sm outline-none placeholder:text-muted focus:ring-2 focus:ring-ink/10 sm:w-64"
          />
        </label>
      ) : (
        !compact && (
          <p className="mb-2 text-xs text-muted">
            Commenting as <span className="font-medium text-ink">{name}</span>
            {" · "}
            <button
              type="button"
              onClick={() => {
                setDraftName(name ?? "");
                setEditingName(true);
              }}
              className="font-medium text-brand hover:underline"
            >
              Change
            </button>
          </p>
        )
      )}
      <label className="block">
        <span className="sr-only">{placeholder}</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={placeholder}
          rows={compact ? 2 : 3}
          maxLength={2000}
          autoFocus={autoFocus && !needsName}
          className="w-full resize-y bg-transparent text-sm leading-6 outline-none placeholder:text-muted"
        />
      </label>
      <div className="mt-2 flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-1.5 text-xs font-medium text-muted hover:bg-surface hover:text-ink"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
