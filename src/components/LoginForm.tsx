"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login, type LoginState } from "@/lib/auth-actions";

const initialState: LoginState = { error: null, email: "" };

const inputClass =
  "h-12 w-full rounded-lg border border-ink/5 bg-ink/3 px-4 text-[15px] text-ink outline-none transition placeholder:text-ink/45 focus:border-ink/30 focus:bg-white";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const next = useSearchParams().get("next") ?? "";
  const signupHref = next ? `/signup?next=${encodeURIComponent(next)}` : "/signup";

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />
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
        className={`rounded-lg bg-brand-soft px-4 py-3 text-sm text-brand-ink ${
          state.error ? "" : "hidden"
        }`}
      >
        {state.error}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-full bg-ink text-[15px] font-medium text-white transition-colors hover:bg-brand disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Signing in…" : "Log in"}
      </button>

      <p className="text-center text-sm text-muted">
        New to News 24?{" "}
        <Link href={signupHref} className="font-medium text-ink underline-offset-2 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
