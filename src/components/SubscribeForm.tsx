"use client";

import { useState } from "react";
import { subscribeEmail, useEngagement } from "@/lib/engagement";

/** Saves the email in this browser until the backend has a newsletter endpoint. */
export default function SubscribeForm() {
  const { subscribedEmail } = useEngagement();
  const [email, setEmail] = useState("");

  if (subscribedEmail) {
    return (
      <p className="text-base text-white/80" role="status">
        Thanks! <span className="font-medium text-white">{subscribedEmail}</span> is subscribed
        to our latest updates.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        subscribeEmail(email.trim());
      }}
      className="flex w-full max-w-lg flex-col gap-3 sm:flex-row"
    >
      <label className="sr-only" htmlFor="subscribe-email">
        Email address
      </label>
      <input
        id="subscribe-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="h-12 w-full rounded-full border sm:flex-1 border-white/25 bg-white/10 px-5 text-[15px] text-white outline-none placeholder:text-white/55 focus:border-white"
      />
      <button
        type="submit"
        className="h-12 rounded-full border border-transparent bg-white px-6 text-[15px] font-medium whitespace-nowrap text-ink transition-colors hover:border-white hover:bg-transparent hover:text-white"
      >
        Subscribe
      </button>
    </form>
  );
}
