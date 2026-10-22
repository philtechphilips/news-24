"use client";

import { useState } from "react";
import { subscribeEmail, useEngagement } from "@/lib/engagement";
import { ArrowRightIcon } from "./icons";

/** Saves the email in this browser until the backend has a newsletter endpoint. */
export default function SubscribeForm({ variant }: { variant: "banner" | "footer" }) {
  const { subscribedEmail } = useEngagement();
  const [email, setEmail] = useState("");

  if (subscribedEmail) {
    return (
      <p
        className={`text-sm ${variant === "banner" ? "text-white/80" : "text-white/70"}`}
        role="status"
      >
        Thanks! <span className="font-medium text-white">{subscribedEmail}</span> is
        subscribed to our latest updates.
      </p>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    subscribeEmail(email.trim());
  };

  if (variant === "footer") {
    return (
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <label className="sr-only" htmlFor="footer-email">
          Email address
        </label>
        <input
          id="footer-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email…"
          className="h-9 w-full max-w-56 rounded-full bg-white px-4 text-xs text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-brand"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="grid size-9 shrink-0 place-items-center rounded-full border border-white/60 text-white transition hover:bg-white hover:text-ink"
        >
          <ArrowRightIcon size={15} />
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-2 sm:flex-row"
    >
      <label className="sr-only" htmlFor="banner-email">
        Email address
      </label>
      <input
        id="banner-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email…"
        className="h-11 flex-1 rounded-md bg-white px-4 text-sm text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-brand"
      />
      <button
        type="submit"
        className="h-11 rounded-md bg-brand px-5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-brand-dark"
      >
        Subscribe now
      </button>
    </form>
  );
}
