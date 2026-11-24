import type { Metadata } from "next";
import RoleSelect from "@/components/admin/RoleSelect";
import { Card, formatDate, PageHeader } from "@/components/admin/ui";
import { api, getCurrentUser } from "@/lib/api";
import type { ApiUser } from "@/lib/api-types";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const [users, me] = await Promise.all([api<ApiUser[]>("/users/?limit=100"), getCurrentUser()]);

  return (
    <>
      <PageHeader
        title="Users"
        description="Everyone with an account. Admins can use this dashboard."
      />
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/5 text-xs text-muted">
            <tr>
              <th className="w-full px-5 py-3 font-medium">Email</th>
              <th className="hidden px-5 py-3 font-medium sm:table-cell">Joined</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {users.map((user) => {
              const isMe = user.id === me?.id;
              return (
                <tr key={user.id}>
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
                  <td className="hidden px-5 py-3.5 whitespace-nowrap text-muted sm:table-cell">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-5 py-3.5">
                    {isMe ? (
                      // The API won't let admins change their own role.
                      <span className="text-sm text-muted">Admin</span>
                    ) : (
                      <RoleSelect userId={user.id} email={user.email} role={user.role} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      {users.length >= 100 && (
        <p className="mt-3 text-xs text-muted">Showing the 100 most recent users.</p>
      )}
    </>
  );
}
