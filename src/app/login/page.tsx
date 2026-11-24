import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your News 24 account.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-sm px-4 py-16 sm:py-24">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-brand">
        Welcome back
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Log in to News 24</h1>
      <p className="mt-2 text-sm text-muted">
        Sign in to join the conversation on the stories you read.
      </p>

      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
