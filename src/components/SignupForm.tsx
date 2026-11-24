"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signup, type SignupState } from "@/lib/auth-actions";

const initialState: SignupState = { error: null, fields: {}, name: "", email: "" };

const inputClass =
  "h-12 w-full rounded-lg border border-ink/5 bg-ink/3 px-4 text-[15px] text-ink outline-none transition placeholder:text-ink/45 focus:border-ink/30 focus:bg-white aria-invalid:border-brand";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);
  const next = useSearchParams().get("next") ?? "";
  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : "/login";

  const field = (
    name: "name" | "email" | "password",
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
  ) => (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-xs font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        required
        aria-invalid={Boolean(state.fields[name])}
        aria-describedby={state.fields[name] ? `${name}-error` : undefined}
        className={inputClass}
        {...props}
      />
      {state.fields[name] && (
        <p id={`${name}-error`} className="text-xs text-brand-ink">
          {state.fields[name]}
        </p>
      )}
    </div>
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      {field("name", "Name", {
        autoComplete: "name",
        maxLength: 60,
        defaultValue: state.name,
        placeholder: "Shown on your comments",
      })}
      {field("email", "Email", {
        type: "email",
        autoComplete: "email",
        defaultValue: state.email,
        placeholder: "you@example.com",
      })}
      {field("password", "Password", {
        type: "password",
        autoComplete: "new-password",
        minLength: 8,
        placeholder: "At least 8 characters",
      })}

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
        {pending ? "Creating your account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href={loginHref} className="font-medium text-ink underline-offset-2 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
