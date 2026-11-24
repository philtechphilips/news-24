import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api";
import { logout } from "@/lib/auth-actions";
import { btnPrimary, btnSecondary, Card } from "./ui";

/**
 * Lets admins through. Signed-out visitors go to the login page; signed-in
 * non-admins see a notice. The API checks the role on every request too.
 */
export default async function AdminGate({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");

  if (user.role !== "admin") {
    return (
      <Card className="mx-auto mt-10 max-w-md px-8 py-12 text-center">
        <p className="font-display text-2xl">Admins only</p>
        <p className="mt-2 text-sm text-muted">
          You&apos;re signed in as <span className="font-medium text-ink">{user.email}</span>,
          which doesn&apos;t have access to the dashboard.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/" className={btnSecondary}>
            Back to site
          </Link>
          <form action={logout}>
            <button type="submit" className={btnPrimary}>
              Switch account
            </button>
          </form>
        </div>
      </Card>
    );
  }

  return children;
}
