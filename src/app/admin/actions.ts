"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { ApiPost, FormState, Role } from "@/lib/api-types";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

/** Runs an API call; API errors become form errors, anything else is rethrown. */
async function attempt(call: () => Promise<unknown>): Promise<FormState> {
  try {
    await call();
  } catch (error) {
    if (error instanceof ApiError) return error.toFormState();
    throw error;
  }
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
  redirect(`/admin/posts?saved=${encodeURIComponent(saved.title)}`);
}

export async function deletePost(formData: FormData) {
  await api(`/posts/${text(formData, "id")}`, { method: "DELETE" });
  refresh();
}

// ---------- Categories ----------

export async function createCategory(_prev: FormState, formData: FormData) {
  return attempt(() =>
    api("/categories/", { method: "POST", json: { name: text(formData, "name") } }),
  );
}

export async function renameCategory(_prev: FormState, formData: FormData) {
  return attempt(() =>
    api(`/categories/${text(formData, "id")}`, {
      method: "PATCH",
      json: { name: text(formData, "name") },
    }),
  );
}

export async function deleteCategory(formData: FormData) {
  await api(`/categories/${text(formData, "id")}`, { method: "DELETE" });
  refresh();
}

// ---------- Users ----------

export async function setUserRole(_prev: FormState, formData: FormData) {
  const role = text(formData, "role") as Role;
  return attempt(() =>
    api(`/users/${text(formData, "id")}/role`, { method: "PATCH", json: { role } }),
  );
}
