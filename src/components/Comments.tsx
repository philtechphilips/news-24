"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { timeAgo } from "@/lib/content";
import { type LiveComment, type LiveStatus, useLivePost } from "@/lib/use-live-post";
import { HeartIcon, ReplyIcon, TrashIcon } from "./icons";

type SortOrder = "top" | "newest";

const MAX_INDENT = 3;
const avatarColors = ["bg-brand", "bg-blue-600", "bg-green-600", "bg-amber-500", "bg-purple-600", "bg-teal-600"];

function avatarColor(id: string) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

// A clock for the "5m ago" labels, ticking every minute. It starts when the
// comments mount in the browser (reading the time while the page is
// prerendered would freeze it), and reads 0 until then.
let clock = 0;
function subscribeClock(onTick: () => void) {
  clock = Date.now();
  const timer = setInterval(() => {
    clock = Date.now();
    onTick();
  }, 60_000);
  return () => clearInterval(timer);
}
const useNow = () =>
  useSyncExternalStore(
    subscribeClock,
    () => clock,
    () => 0,
  );

export default function Comments() {
  const live = useLivePost();
  const [sort, setSort] = useState<SortOrder>("top");
  const now = useNow();
  const { comments } = live;

  const newestFirst = (a: LiveComment, b: LiveComment) => b.created_at.localeCompare(a.created_at);
  const sorter =
    sort === "top"
      ? (a: LiveComment, b: LiveComment) => b.likes - a.likes || newestFirst(a, b)
      : newestFirst;
  const childrenOf = (parentId: string | null) =>
    comments
      .filter((c) => c.parent_id === parentId)
      // Replies read top to bottom in the order they were written.
      .sort(parentId === null ? sorter : (a, b) => -newestFirst(a, b));

  return (
    <section id="comments" aria-labelledby="comments-heading" className="scroll-mt-28">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 id="comments-heading" className="text-2xl font-medium tracking-tight">
            Comments{" "}
            {live.loaded && <span className="text-muted">({comments.length})</span>}
          </h2>
          <LiveBadge status={live.status} />
        </div>
        {comments.length > 1 && (
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
        {!live.loaded ? null : live.viewer ? (
          <CommentForm
            submitLabel="Post comment"
            placeholder="Share your thoughts on this story…"
            onSubmit={(body) => live.addComment(body, null)}
          />
        ) : (
          <JoinPrompt />
        )}
      </div>

      {!live.loaded ? (
        <p className="mt-10 rounded-lg bg-surface py-10 text-center text-sm text-muted" role="status">
          {live.loadFailed ? "Comments couldn't load. Trying again…" : "Loading comments…"}
        </p>
      ) : comments.length === 0 ? (
        <p className="mt-10 rounded-lg bg-surface py-10 text-center text-sm text-muted">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ul className="mt-10 space-y-8" aria-live="polite" aria-relevant="additions">
          {childrenOf(null).map((comment) => (
            <CommentItem key={comment.id} comment={comment} depth={0} childrenOf={childrenOf} now={now} />
          ))}
        </ul>
      )}
    </section>
  );
}

function LiveBadge({ status }: { status: LiveStatus }) {
  const live = status === "live";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-muted"
      title={live ? "New comments and likes appear as they happen" : undefined}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${live ? "bg-green-600 motion-safe:animate-pulse" : "bg-neutral-400"}`}
      />
      {live ? "Live" : status === "connecting" ? "Connecting…" : "Reconnecting…"}
    </span>
  );
}

function JoinPrompt() {
  const { loginHref, signupHref } = useLivePost();
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted">
        <span className="block font-medium text-ink">Join the conversation</span>
        Log in to comment, reply and like.
      </p>
      <div className="flex shrink-0 gap-2">
        <Link
          href={loginHref}
          className="rounded-full border border-ink px-4 py-2 text-xs font-semibold transition hover:bg-ink hover:text-white"
        >
          Log in
        </Link>
        <Link
          href={signupHref}
          className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-dark"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  depth,
  childrenOf,
  now,
  replyingTo,
}: {
  comment: LiveComment;
  depth: number;
  childrenOf: (id: string) => LiveComment[];
  now: number;
  replyingTo?: string;
}) {
  const live = useLivePost();
  const [replying, setReplying] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const replies = childrenOf(comment.id);
  const liked = live.likedComments.includes(comment.id);
  const mine = live.viewer?.id === comment.author.id;
  const canDelete = mine || live.viewer?.isAdmin;

  async function remove() {
    setDeleting(true);
    const error = await live.deleteComment(comment.id);
    // On success this comment unmounts; only an error needs handling.
    if (error) {
      setDeleteError(error);
      setDeleting(false);
      setConfirmingDelete(false);
    }
  }

  return (
    <li>
      <article className={`flex gap-3 rounded-lg ${comment.fresh ? "comment-arrived" : ""}`}>
        <span
          aria-hidden="true"
          className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white ${avatarColor(comment.author.id)}`}
        >
          {initials(comment.author.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-medium">{comment.author.name}</span>
            {mine && (
              <span className="rounded-sm bg-brand-soft px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                You
              </span>
            )}
            <time dateTime={comment.created_at} className="text-xs text-muted">
              {timeAgo(comment.created_at, now)}
            </time>
          </div>
          <p className="mt-1.5 text-sm leading-6 break-words whitespace-pre-wrap text-neutral-700">
            {replyingTo && <span className="font-medium text-brand">@{replyingTo} </span>}
            {comment.body}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-muted">
            <button
              type="button"
              onClick={() => live.toggleCommentLike(comment.id)}
              aria-pressed={liked}
              aria-label={`${comment.likes} likes. ${
                !live.viewer ? "Log in to like" : liked ? "Unlike comment" : "Like comment"
              }`}
              className={`flex items-center gap-1.5 rounded-full px-2 py-1 tabular-nums transition hover:bg-surface ${
                liked ? "text-brand" : "hover:text-ink"
              }`}
            >
              <HeartIcon filled={liked} size={14} />
              {comment.likes}
            </button>
            {live.viewer ? (
              <button
                type="button"
                onClick={() => setReplying((r) => !r)}
                aria-expanded={replying}
                className="flex items-center gap-1.5 rounded-full px-2 py-1 transition hover:bg-surface hover:text-ink"
              >
                <ReplyIcon size={14} /> Reply
              </button>
            ) : (
              <Link
                href={live.loginHref}
                className="flex items-center gap-1.5 rounded-full px-2 py-1 transition hover:bg-surface hover:text-ink"
              >
                <ReplyIcon size={14} /> Reply
              </Link>
            )}
            {canDelete &&
              (confirmingDelete ? (
                <span className="flex items-center gap-1 pl-1">
                  <span>Delete{replies.length > 0 ? " with replies" : ""}?</span>
                  <button
                    type="button"
                    onClick={remove}
                    disabled={deleting}
                    className="rounded-full px-2 py-1 font-medium text-brand hover:bg-brand-soft disabled:opacity-50"
                  >
                    {deleting ? "Deleting…" : "Yes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    disabled={deleting}
                    className="rounded-full px-2 py-1 hover:bg-surface hover:text-ink"
                  >
                    No
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setDeleteError(null);
                    setConfirmingDelete(true);
                  }}
                  className="flex items-center gap-1.5 rounded-full px-2 py-1 transition hover:bg-surface hover:text-brand"
                >
                  <TrashIcon size={14} /> Delete
                </button>
              ))}
          </div>
          {deleteError && (
            <p role="alert" className="mt-1 text-xs text-brand">
              {deleteError}
            </p>
          )}

          {replying && (
            <div className="mt-3">
              <CommentForm
                autoFocus
                compact
                submitLabel="Reply"
                placeholder={`Reply to ${comment.author.name}…`}
                onCancel={() => setReplying(false)}
                onSubmit={async (body) => {
                  const error = await live.addComment(body, comment.id);
                  if (!error) setReplying(false);
                  return error;
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
              childrenOf={childrenOf}
              now={now}
              // Past the indent limit, mention who is being replied to instead.
              replyingTo={depth + 1 > MAX_INDENT ? comment.author.name : undefined}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/** For logged-in readers. Asks for a display name first if they have none. */
function CommentForm({
  onSubmit,
  onCancel,
  submitLabel,
  placeholder,
  autoFocus = false,
  compact = false,
}: {
  onSubmit: (body: string) => Promise<string | null>;
  onCancel?: () => void;
  submitLabel: string;
  placeholder: string;
  autoFocus?: boolean;
  compact?: boolean;
}) {
  const { viewer, setName } = useLivePost();
  const name = viewer?.name ?? null;
  const [draftName, setDraftName] = useState("");
  const [body, setBody] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsName = !name || editingName;
  const canSubmit = !pending && body.trim() !== "" && (!needsName || draftName.trim() !== "");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setPending(true);
    setError(null);
    let failed = needsName && draftName.trim() !== name ? await setName(draftName.trim()) : null;
    if (!failed) {
      setEditingName(false);
      failed = await onSubmit(body.trim());
    }
    setPending(false);
    if (failed) setError(failed);
    else setBody("");
  }

  return (
    <form
      onSubmit={submit}
      className={`rounded-lg border border-line bg-white focus-within:border-ink ${compact ? "p-3" : "p-4"}`}
    >
      {needsName ? (
        <label className="mb-3 block">
          <span className="mb-1 block text-xs text-muted">
            {name ? "Change the name shown on your comments" : "Choose the name shown on your comments"}
          </span>
          <input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder="Your name"
            maxLength={60}
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
      {error && (
        <p role="alert" className="mt-1 text-xs text-brand">
          {error}
        </p>
      )}
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
          {pending ? "Posting…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
