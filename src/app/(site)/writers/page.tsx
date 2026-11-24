import type { Metadata } from "next";
import Link from "next/link";
import { Avatar, PageIntro } from "@/components/cards";
import { getBlog } from "@/lib/blog";
import { postsByWriter } from "@/lib/content";

export const metadata: Metadata = {
  title: "Staff Writers",
  description: "Meet the journalists, editors and writers behind News 24.",
};

export default async function WritersPage() {
  const blog = await getBlog();

  return (
    <div className="page-shell pb-24 md:pb-32">
      <PageIntro
        eyebrow="Staff Writers"
        title="The people behind the stories"
        description="Reporters, editors and specialists covering everything from global markets to design systems. Get to know them and read their latest work."
      />

      {blog.writers.length === 0 ? (
        <p className="rounded-xl bg-surface py-16 text-center text-muted">No writers yet.</p>
      ) : (
        <ul className="grid gap-x-4 gap-y-12 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {blog.writers.map((writer) => {
            const count = postsByWriter(blog, writer.slug).length;
            return (
              <li key={writer.slug}>
                <Link href={`/writers/${writer.slug}`} className="group block">
                  <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-surface text-5xl">
                    <Avatar
                      writer={writer}
                      sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
                      className="transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="mt-4 text-base font-medium group-hover:text-brand">{writer.name}</p>
                  <p className="text-xs text-muted">{writer.role}</p>
                </Link>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {writer.beats.map((beat) => (
                    <li key={beat} className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-medium">
                      {beat}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted">
                  {count} {count === 1 ? "article" : "articles"}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
