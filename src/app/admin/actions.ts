"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { BLOG_TAG } from "@/lib/blog";
import type { ApiPost, FormState } from "@/lib/api-types";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

/** Runs an API call; API errors become form errors, anything else is rethrown. */
async function attempt(
  call: () => Promise<unknown>,
  { publicContent = false } = {},
): Promise<FormState> {
  try {
    await call();
  } catch (error) {
    if (error instanceof ApiError) return error.toFormState();
    throw error;
  }
  if (publicContent) updateTag(BLOG_TAG);
  refresh();
  return { ok: true };
}

// ---------- Posts ----------

export async function savePost(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = text(formData, "id");
  const slug = text(formData, "slug");
  const payload = {
    title: text(formData, "title"),
    body: text(formData, "body"),
    // Blank means "generate one" on create and "keep it" on edit.
    ...(slug && { slug }),
    excerpt: text(formData, "excerpt") || null,
    featured_image: text(formData, "featured_image") || null,
    category_id: text(formData, "category_id") || null,
    tags: text(formData, "tags")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    is_published: formData.get("is_published") === "on",
  };

  let saved: ApiPost;
  try {
    saved = id
      ? await api<ApiPost>(`/posts/${id}`, { method: "PATCH", json: payload })
      : await api<ApiPost>("/posts/", { method: "POST", json: payload });
  } catch (error) {
    if (error instanceof ApiError) return error.toFormState();
    throw error;
  }
  // The public site shows the change on its next request.
  updateTag(BLOG_TAG);
  redirect(`/admin/posts?saved=${encodeURIComponent(saved.title)}`);
}

export async function deletePost(formData: FormData) {
  await api(`/posts/${text(formData, "id")}`, { method: "DELETE" });
  updateTag(BLOG_TAG);
  refresh();
}

// ---------- Categories ----------

export async function createCategory(_prev: FormState, formData: FormData) {
  return attempt(() =>
    api("/categories/", { method: "POST", json: { name: text(formData, "name") } }),
    { publicContent: true },
  );
}

export async function renameCategory(_prev: FormState, formData: FormData) {
  return attempt(() =>
    api(`/categories/${text(formData, "id")}`, {
      method: "PATCH",
      json: { name: text(formData, "name") },
    }),
    { publicContent: true },
  );
}

export async function deleteCategory(formData: FormData) {
  await api(`/categories/${text(formData, "id")}`, { method: "DELETE" });
  updateTag(BLOG_TAG);
  refresh();
}

// ---------- Users ----------

export async function createAdmin(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = text(formData, "email");
  const result = await attempt(() =>
    api("/users/admins", {
      method: "POST",
      json: { email, password: String(formData.get("password") ?? "") },
    }),
  );
  return result.ok ? { ok: true, message: `${email} can now use the dashboard.` } : result;
}

/** Grants admin rights when `admin` is "true", removes them otherwise. */
export async function setAdmin(formData: FormData) {
  const method = formData.get("admin") === "true" ? "PUT" : "DELETE";
  await api(`/users/${text(formData, "id")}/admin`, { method });
  refresh();
}

export async function deleteUser(formData: FormData) {
  await api(`/users/${text(formData, "id")}`, { method: "DELETE" });
  refresh();
}
