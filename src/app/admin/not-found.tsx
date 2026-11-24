import Link from "next/link";
import { btnPrimary, Card } from "@/components/admin/ui";

export default function AdminNotFound() {
  return (
    <Card className="mx-auto mt-10 max-w-md px-8 py-12 text-center">
      <p className="font-display text-2xl">Not found</p>
      <p className="mt-2 text-sm text-muted">It may have been deleted, or the link is wrong.</p>
      <Link href="/admin/posts" className={`${btnPrimary} mt-6`}>
        Back to posts
      </Link>
    </Card>
  );
}
