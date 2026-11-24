import type { Metadata } from "next";
import { Suspense } from "react";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a News 24 account to comment on and like stories.",
};

export default function SignupPage() {
  return (
    <div className="mx-auto w-full max-w-sm px-5 py-16 sm:py-28">
      <p className="text-sm font-medium text-brand-ink">Join News 24</p>
      <h1 className="mt-2 font-display text-4xl leading-[1.1]">Create your account</h1>
      <p className="mt-2 text-sm text-muted">
        Comment, reply and like the stories you read. It&apos;s free.
      </p>

      <div className="mt-8">
        {/* SignupForm reads ?next=, which needs a Suspense boundary */}
        <Suspense>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
