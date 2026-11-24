"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { savePost } from "@/app/admin/actions";
import type { ApiCategory, ApiPost, FormState } from "@/lib/api-types";
import { btnPrimary, btnSecondary, Card, inputClass, labelClass } from "./ui";

/** Mirrors the backend's slugify, for the URL preview only. */
const slugify = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function PostForm({
  post,
  categories,
}: {
  post?: ApiPost;
  categories: ApiCategory[];
}) {
  const [state, formAction, pending] = useActionState(savePost, {} as FormState);
  const [values, setValues] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    body: post?.body ?? "",
    category_id: post?.category_id ?? "",
    featured_image: post?.featured_image ?? "",
    tags: post?.tags.join(", ") ?? "",
    is_published: post?.is_published ?? false,
  });

  const set =
    (key: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({
        ...v,
        [key]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value,
      }));

  const error = (key: string) =>
    state.fields?.[key] && (
      <p className="mt-1.5 text-sm text-brand">{state.fields[key]}</p>
    );
  const slugPreview = values.slug ? slugify(values.slug) : post?.slug || slugify(values.title);
  const imageUrl = /^https?:\/\/\S+$/.test(values.featured_image) ? values.featured_image : null;

  return (
    <form action={formAction} className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="space-y-6">
        {state.error && (
          <p role="alert" className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-ink">
            {state.error}
          </p>
        )}

        <Card className="space-y-5 p-5 md:p-6">
          <div>
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              minLength={3}
              maxLength={255}
              value={values.title}
              onChange={set("title")}
              placeholder="A headline that makes people click"
              className={`${inputClass} font-display text-xl md:text-2xl`}
            />
            {error("title")}
          </div>

          <div>
            <label htmlFor="excerpt" className={labelClass}>
              Excerpt <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              maxLength={500}
              value={values.excerpt}
              onChange={set("excerpt")}
              placeholder="One or two sentences shown on cards and in search results."
              className={`${inputClass} resize-y`}
            />
            <div className="mt-1 flex justify-between text-xs text-muted">
              {error("excerpt") || <span />}
              <span>{values.excerpt.length}/500</span>
            </div>
          </div>

          <div>
            <label htmlFor="body" className={labelClass}>
              Story
            </label>
            <textarea
              id="body"
              name="body"
              required
              rows={18}
              value={values.body}
              onChange={set("body")}
              placeholder="Start writing…"
              className={`${inputClass} resize-y leading-7`}
            />
            <p className="mt-1.5 text-xs text-muted">
              Leave a blank line between paragraphs. Start a line with <code>## </code> for a
              heading, <code>&gt; </code> for a quote or <code>- </code> for a list item.
            </p>
            {error("body")}
          </div>
        </Card>
      </div>

      <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
        <Card className="p-5">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="block text-sm font-medium">Published</span>
              <span className="block text-xs text-muted">
                {values.is_published ? "Visible on the site" : "Saved as a draft"}
              </span>
            </span>
            <input
              type="checkbox"
              name="is_published"
              checked={values.is_published}
              onChange={set("is_published")}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className="relative h-6 w-11 shrink-0 rounded-full bg-ink/15 transition-colors peer-checked:bg-emerald-500 peer-focus-visible:ring-4 peer-focus-visible:ring-ink/10 after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
            />
          </label>
          <div className="mt-5 flex gap-2">
            <button type="submit" disabled={pending} className={`${btnPrimary} flex-1`}>
              {pending ? "Saving…" : post ? "Save changes" : "Create post"}
            </button>
            <Link href="/admin/posts" className={btnSecondary}>
              Cancel
            </Link>
          </div>
        </Card>

        <Card className="space-y-5 p-5">
          <div>
            <label htmlFor="category_id" className={labelClass}>
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              value={values.category_id}
              onChange={set("category_id")}
              className={inputClass}
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="mt-1.5 text-xs text-muted">
                <Link href="/admin/categories" className="underline">
                  Add categories
                </Link>{" "}
                to file posts under topics.
              </p>
            )}
            {error("category_id")}
          </div>

          <div>
            <label htmlFor="slug" className={labelClass}>
              URL slug
            </label>
            <input
              id="slug"
              name="slug"
              value={values.slug}
              onChange={set("slug")}
              placeholder={post?.slug || "generated-from-title"}
              className={inputClass}
            />
            <p className="mt-1.5 truncate text-xs text-muted">
              /blogs/<span className="text-ink">{slugPreview || "…"}</span>
            </p>
            {error("slug")}
          </div>

          <div>
            <label htmlFor="tags" className={labelClass}>
              Tags
            </label>
            <input
              id="tags"
              name="tags"
              value={values.tags}
              onChange={set("tags")}
              placeholder="markets, interest rates"
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-muted">Separate tags with commas.</p>
          </div>

          <div>
            <label htmlFor="featured_image" className={labelClass}>
              Cover image URL
            </label>
            <input
              id="featured_image"
              name="featured_image"
              type="url"
              value={values.featured_image}
              onChange={set("featured_image")}
              placeholder="https://…"
              className={inputClass}
            />
            {error("featured_image")}
            {imageUrl && (
              // A plain <img>: any host is allowed here, unlike next/image.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Cover preview"
                className="mt-3 aspect-312/163 w-full rounded-lg bg-surface object-cover"
              />
            )}
          </div>
        </Card>
      </div>
    </form>
  );
}
