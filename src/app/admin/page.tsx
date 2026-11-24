import type { Metadata } from "next";
import Link from "next/link";
import { FileTextIcon, PencilIcon, PlusIcon, TagIcon, UsersIcon } from "@/components/icons";
import { btnPrimary, Card, formatDate, PageHeader, StatusPill } from "@/components/admin/ui";
import { api, getCurrentUser } from "@/lib/api";
import type { ApiCategory, ApiPost, ApiUser } from "@/lib/api-types";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const [posts, categories, users, me] = await Promise.all([
    api<ApiPost[]>("/posts/all"),
    api<ApiCategory[]>("/categories/?limit=100"),
    api<ApiUser[]>("/users/?limit=100"),
    getCurrentUser(),
  ]);

  const published = posts.filter((p) => p.is_published).length;
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));
  const stats = [
    { label: "Published", value: published, note: "Live on the site", Icon: FileTextIcon },
    { label: "Drafts", value: posts.length - published, note: "Waiting to publish", Icon: PencilIcon },
    { label: "Categories", value: categories.length, note: "Topics to file under", Icon: TagIcon },
    {
      label: "Users",
      value: users.length,
      note: `${users.filter((u) => u.role === "admin").length} with admin access`,
      Icon: UsersIcon,
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${me?.email.split("@")[0]}. Here's what's happening.`}
        actions={
          <Link href="/admin/posts/new" className={btnPrimary}>
            <PlusIcon size={16} /> New post
          </Link>
        }
      />

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, note, Icon }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-muted">{label}</dt>
              <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand-ink">
                <Icon size={16} />
              </span>
            </div>
            <dd className="mt-3 font-display text-4xl">{value}</dd>
            <p className="mt-1 text-xs text-muted">{note}</p>
          </Card>
        ))}
      </dl>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <div className="flex items-center justify-between border-b border-ink/5 px-5 py-4">
            <h2 className="font-medium">Recently updated</h2>
            <Link href="/admin/posts" className="text-sm text-muted hover:text-ink">
              All posts →
            </Link>
          </div>
          {posts.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted">
              No posts yet.{" "}
              <Link href="/admin/posts/new" className="font-medium text-ink underline">
                Write the first one
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-ink/5">
              {posts.slice(0, 6).map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{post.title}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {categoryName.get(post.category_id ?? "") ?? "Uncategorised"} · Updated{" "}
                        {formatDate(post.updated_at)}
                      </p>
                    </div>
                    <StatusPill published={post.is_published} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="font-medium">Shortcuts</h2>
          <ul className="mt-4 space-y-2">
            {[
              { href: "/admin/posts/new", label: "Write a new post", Icon: PlusIcon },
              { href: "/admin/posts?status=draft", label: "Review drafts", Icon: PencilIcon },
              { href: "/admin/categories", label: "Organise categories", Icon: TagIcon },
              { href: "/admin/users", label: "Manage who's an admin", Icon: UsersIcon },
            ].map(({ href, label, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 rounded-lg border border-ink/5 px-3.5 py-3 text-sm transition-colors hover:border-ink/15 hover:bg-surface"
                >
                  <Icon size={16} className="text-brand-ink" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
