"use client";

import { btnPrimary, Card } from "@/components/admin/ui";

export default function AdminError({ retry }: { error: Error; retry: () => void }) {
  return (
    <Card className="mx-auto mt-10 max-w-md px-8 py-12 text-center">
      <p className="font-display text-2xl">We couldn&apos;t load this page</p>
      <p className="mt-2 text-sm text-muted">
        The API may be offline or returned an error. Make sure the backend is running, then
        try again.
      </p>
      <button type="button" onClick={() => retry()} className={`${btnPrimary} mt-6`}>
        Try again
      </button>
    </Card>
  );
}
