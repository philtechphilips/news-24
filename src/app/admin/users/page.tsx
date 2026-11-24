import type { Metadata } from "next";
import Link from "next/link";
import { deleteUser, setAdmin } from "@/app/admin/actions";
import AddAdminForm from "@/components/admin/AddAdminForm";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { btnIcon, btnSecondary, Card, formatDate, PageHeader } from "@/components/admin/ui";
import { TrashIcon } from "@/components/icons";
import { api, getCurrentUser } from "@/lib/api";
import type { ApiUser } from "@/lib/api-types";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage({ searchParams }: PageProps<"/admin/users">) {
  const adminsOnly = (await searchParams).role === "admin";
  const [users, admins, me] = await Promise.all([
    api<ApiUser[]>("/users/?limit=100"),
    api<ApiUser[]>("/users/admins"),
    getCurrentUser(),
  ]);
  const shown = adminsOnly ? admins : users;
  const tabs = [
    { href: "/admin/users", label: "All", count: users.length, active: !adminsOnly },
    { href: "/admin/users?role=admin", label: "Admins", count: admins.length, active: adminsOnly },
  ];

  return (
    <>
      <PageHeader
        title="Users"
        description="Everyone with an account. Admins can use this dashboard."
      />

      <div className="space-y-6">
        <AddAdminForm />

        <div>
          <nav aria-label="Filter users" className="mb-4 flex gap-1">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={tab.active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  tab.active ? "bg-ink text-white" : "text-muted hover:bg-white hover:text-ink"
                }`}
              >
                {tab.label}
                <span className="ml-1.5 opacity-60">{tab.count}</span>
              </Link>
            ))}
          </nav>

          <Card className="overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink/5 text-xs text-muted">
                <tr>
                  <th className="w-full px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">Joined</th>
                  <th className="px-5 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {shown.map((user) => (
                  <UserRow key={user.id} user={user} isMe={user.id === me?.id} />
                ))}
              </tbody>
            </table>
          </Card>
          {users.length >= 100 && !adminsOnly && (
            <p className="mt-3 text-xs text-muted">Showing the 100 most recent users.</p>
          )}
        </div>
      </div>
    </>
  );
}

function UserRow({ user, isMe }: { user: ApiUser; isMe: boolean }) {
  const isAdmin = user.role === "admin";
  return (
    <tr>
      <td className="max-w-0 px-5 py-3.5">
        <span className="flex items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand-ink uppercase">
            {user.email[0]}
          </span>
          <span className="truncate font-medium">{user.email}</span>
          {isMe && (
            <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-xs text-muted">
              You
            </span>
          )}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            isAdmin ? "bg-brand-soft text-brand-ink" : "bg-surface text-muted"
          }`}
        >
          {isAdmin ? "Admin" : "User"}
        </span>
      </td>
      <td className="hidden px-5 py-3.5 whitespace-nowrap text-muted sm:table-cell">
        {formatDate(user.created_at)}
      </td>
      <td className="px-3 py-3.5">
        {/* The API doesn't let admins demote or delete themselves. */}
        {!isMe && (
          <div className="flex items-center justify-end gap-1">
            <form action={setAdmin}>
              <input type="hidden" name="id" value={user.id} />
              <input type="hidden" name="admin" value={String(!isAdmin)} />
              <ConfirmSubmit
                label={isAdmin ? `Remove admin rights from ${user.email}` : `Make ${user.email} an admin`}
                message={
                  isAdmin
                    ? `Remove admin rights from ${user.email}? They'll keep their account.`
                    : `Give ${user.email} access to this dashboard?`
                }
                className={`${btnSecondary} h-8 px-3.5 text-xs whitespace-nowrap`}
              >
                {isAdmin ? "Remove admin" : "Make admin"}
              </ConfirmSubmit>
            </form>
            <form action={deleteUser}>
              <input type="hidden" name="id" value={user.id} />
              <ConfirmSubmit
                label={`Delete ${user.email}`}
                message={`Delete ${user.email}'s account? This can't be undone.`}
                className={`${btnIcon} hover:bg-brand-soft hover:text-brand`}
              >
                <TrashIcon size={16} />
              </ConfirmSubmit>
            </form>
          </div>
        )}
      </td>
    </tr>
  );
}
