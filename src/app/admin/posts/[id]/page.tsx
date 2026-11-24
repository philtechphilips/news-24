import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { formatDate, PageHeader, StatusPill } from "@/components/admin/ui";
import { api, ApiError } from "@/lib/api";
import type { ApiCategory, ApiPost, ApiWriter } from "@/lib/api-types";

export const metadata: Metadata = { title: "Edit post" };

async function getPost(id: string) {
  try {
    return await api<ApiPost>(`/posts/${id}`);
  } catch (error) {
    // 422 = not a valid UUID, 404 = no such post
    if (error instanceof ApiError && [404, 422].includes(error.status)) notFound();
    throw error;
  }
}

export default async function EditPostPage({ params }: PageProps<"/admin/posts/[id]">) {
  const { id } = await params;
  const [post, categories, writers] = await Promise.all([
    getPost(id),
    api<ApiCategory[]>("/categories/?limit=100"),
    api<ApiWriter[]>("/writers/?limit=100"),
  ]);

  return (
    <>
      <PageHeader
        title="Edit post"
        description={`Created ${formatDate(post.created_at)} · Last updated ${formatDate(post.updated_at)}`}
        actions={<StatusPill published={post.is_published} />}
      />
      <PostForm post={post} categories={categories} writers={writers} />
    </>
  );
}
