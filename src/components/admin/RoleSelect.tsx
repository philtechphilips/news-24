"use client";

import { useActionState } from "react";
import { setUserRole } from "@/app/admin/actions";
import type { FormState, Role } from "@/lib/api-types";

/** Changing the select saves straight away. */
export default function RoleSelect({
  userId,
  email,
  role,
}: {
  userId: string;
  email: string;
  role: Role;
}) {
  const [state, formAction, pending] = useActionState(setUserRole, {} as FormState);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={userId} />
      <label htmlFor={`role-${userId}`} className="sr-only">
        Role for {email}
      </label>
      <select
        id={`role-${userId}`}
        name="role"
        defaultValue={role}
        disabled={pending}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-full border border-ink/10 bg-white py-1.5 pr-8 pl-3 text-sm outline-none transition hover:border-ink/30 focus:border-ink/40 disabled:opacity-60"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      {state.error && <p className="mt-1 text-xs text-brand">{state.error}</p>}
    </form>
  );
}
