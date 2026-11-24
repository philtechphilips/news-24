import type { Metadata } from "next";
import Link from "next/link";
import { deletePost } from "@/app/admin/actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import {
  btnIcon,
  btnPrimary,
  Card,
  EmptyState,
  formatDate,
  PageHeader,
  StatusPill,
} from "@/components/admin/ui";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { api } from "@/lib/api";
import type { ApiCategory, ApiPost } from "@/lib/api-types";

export const metadata: Metadata = { title: "Posts" };

const tabs = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
] as const;

export default async function AdminPostsPage({ searchParams }: PageProps<"/admin/posts">) {
  const params = await searchParams;
  const status = tabs.find((t) => t.value === params.status)?.value ?? "all";
  const saved = typeof params.saved === "string" ? params.saved : null;

  const [posts, categories] = await Promise.all([
    api<ApiPost[]>("/posts/all"),
    api<ApiCategory[]>("/categories/?limit=100"),
  ]);
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));
  const counts = {
    all: posts.length,
    published: posts.filter((p) => p.is_published).length,
    draft: posts.filter((p) => !p.is_published).length,
  };
  const visible = posts.filter(
    (p) => status === "all" || p.is_published === (status === "published"),
  );

  return (
    <>
      <PageHeader
        title="Posts"
        description="Write, edit and publish stories."
        actions={
          <Link href="/admin/posts/new" className={btnPrimary}>
            <PlusIcon size={16} /> New post
          </Link>
        }
      />

      {saved && (
        <p
          role="status"
          className="mb-6 flex items-center justify-between gap-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <span>
            Saved <span className="font-medium">“{saved}”</span>.
          </span>
          <Link href="/admin/posts" className="text-emerald-700 hover:underline">
            Dismiss
          </Link>
        </p>
      )}

      <nav aria-label="Filter posts" className="mb-4 flex gap-1">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === "all" ? "/admin/posts" : `/admin/posts?status=${tab.value}`}
            aria-current={status === tab.value ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              status === tab.value ? "bg-ink text-white" : "text-muted hover:bg-white hover:text-ink"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 opacity-60">{counts[tab.value]}</span>
          </Link>
        ))}
      </nav>

      {visible.length === 0 ? (
        <EmptyState
          title={status === "draft" ? "No drafts" : "No posts yet"}
          description="Posts you write show up here, newest edits first."
          href="/admin/posts/new"
          action="Write a post"
        />
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/5 text-xs text-muted">
              <tr>
                <th className="w-full px-5 py-3 font-medium">Title</th>
                <th className="hidden px-5 py-3 font-medium whitespace-nowrap md:table-cell">Category</th>
                <th className="px-5 py-3 font-medium whitespace-nowrap">Status</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Updated</th>
                <th className="px-5 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {visible.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-surface/60">
                  <td className="max-w-0 px-5 py-3.5">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="block truncate font-medium hover:text-brand-ink"
                    >
                      {post.title}
                    </Link>
                    <span className="block truncate text-xs text-muted">/{post.slug}</span>
                  </td>
                  <td className="hidden px-5 py-3.5 whitespace-nowrap text-muted md:table-cell">
                    {categoryName.get(post.category_id ?? "") ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <StatusPill published={post.is_published} />
                  </td>
                  <td className="hidden px-5 py-3.5 whitespace-nowrap text-muted sm:table-cell">
                    {formatDate(post.updated_at)}
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex justify-end gap-0.5">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        aria-label={`Edit ${post.title}`}
                        title="Edit"
                        className={btnIcon}
                      >
                        <PencilIcon size={16} />
                      </Link>
                      <form action={deletePost}>
                        <input type="hidden" name="id" value={post.id} />
                        <ConfirmSubmit
                          label={`Delete ${post.title}`}
                          message={`Delete “${post.title}”? This can't be undone.`}
                          className={`${btnIcon} hover:bg-brand-soft hover:text-brand`}
                        >
                          <TrashIcon size={16} />
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
