"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/login/actions";

const initialState: LoginState = { error: null, email: "" };

const inputClass =
  "h-11 w-full rounded-md border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-xs font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email}
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-xs font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      <p
        aria-live="polite"
        className={`rounded-md bg-brand-soft px-4 py-3 text-sm text-brand-dark ${
          state.error ? "" : "hidden"
        }`}
      >
        {state.error}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-md bg-brand text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Signing in…" : "Log in"}
      </button>
    </form>
  );
}
