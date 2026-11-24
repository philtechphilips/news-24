import type { Metadata } from "next";
import CategoryManager from "@/components/admin/CategoryManager";
import { PageHeader } from "@/components/admin/ui";
import { api } from "@/lib/api";
import type { ApiCategory, ApiPost } from "@/lib/api-types";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const [categories, posts] = await Promise.all([
    api<ApiCategory[]>("/categories/?limit=100"),
    api<ApiPost[]>("/posts/all"),
  ]);
  const rows = categories.map((c) => ({
    ...c,
    postCount: posts.filter((p) => p.category_id === c.id).length,
  }));

  return (
    <>
      <PageHeader title="Categories" description="Topics that posts are filed under." />
      <CategoryManager categories={rows} />
    </>
  );
}
