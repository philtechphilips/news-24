import type { Metadata } from "next";
import { Suspense } from "react";
import AdminGate from "@/components/admin/AdminGate";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · News 24 Admin" },
  robots: { index: false, follow: false },
};

// Every admin page depends on the signed-in session, so there's no static shell
// to navigate to instantly; opt the section out of instant-navigation checks.
export const instant = false;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 flex-col bg-surface lg:flex-row">
      <AdminSidebar />
      <main id="main-content" className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-12">
        {/* Reads the session cookie, so it streams in behind this boundary. */}
        <Suspense fallback={<AdminSkeleton />}>
          <AdminGate>{children}</AdminGate>
        </Suspense>
      </main>
    </div>
  );
}

function AdminSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Loading">
      <div className="h-9 w-48 rounded-lg bg-ink/6" />
      <div className="mt-3 h-4 w-72 rounded bg-ink/5" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-ink/5" />
        ))}
      </div>
      <div className="mt-6 h-72 rounded-xl bg-ink/5" />
    </div>
  );
}
