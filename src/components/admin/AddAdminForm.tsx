"use client";

import { useActionState } from "react";
import { createAdmin } from "@/app/admin/actions";
import type { FormState } from "@/lib/api-types";
import { PlusIcon } from "../icons";
import { btnPrimary, Card, inputClass } from "./ui";

/** Creates a brand-new account that is an admin from the start. */
export default function AddAdminForm() {
  const [state, formAction, pending] = useActionState(createAdmin, {} as FormState);
  const fieldError = state.fields?.email ?? state.fields?.password;

  return (
    <Card className="p-5">
      <h2 className="font-medium">Add an admin</h2>
      <p className="mt-1 text-sm text-muted">
        Creates a new account with dashboard access. To promote someone who already has an
        account, use “Make admin” in the list below.
      </p>
      <form action={formAction} className="mt-4 flex flex-col gap-3 md:flex-row">
        <label htmlFor="admin-email" className="sr-only">
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="off"
          placeholder="Email"
          className={`${inputClass} md:flex-1`}
        />
        <label htmlFor="admin-password" className="sr-only">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Password (8+ characters)"
          className={`${inputClass} md:flex-1`}
        />
        <button type="submit" disabled={pending} className={btnPrimary}>
          <PlusIcon size={16} /> {pending ? "Adding…" : "Add admin"}
        </button>
      </form>
      {(state.error || fieldError) && (
        <p role="alert" className="mt-2 text-sm text-brand">
          {fieldError ?? state.error}
        </p>
      )}
      {state.ok && state.message && (
        <p role="status" className="mt-2 text-sm text-emerald-700">
          {state.message}
        </p>
      )}
    </Card>
  );
}
