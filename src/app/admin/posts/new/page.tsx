import type { Metadata } from "next";
import PostForm from "@/components/admin/PostForm";
import { PageHeader } from "@/components/admin/ui";
import { api } from "@/lib/api";
import type { ApiCategory } from "@/lib/api-types";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  const categories = await api<ApiCategory[]>("/categories/?limit=100");
  return (
    <>
      <PageHeader title="New post" description="Save it as a draft until it's ready to go live." />
      <PostForm categories={categories} />
    </>
  );
}
