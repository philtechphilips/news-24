import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/cards";
import { writers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Staff Writers",
  description: "Meet the journalists, editors and writers behind News 24.",
};

export default function WritersPage() {
  return (
    <div className="page-shell pb-24 md:pb-32">
      <PageIntro
        eyebrow="Staff Writers"
        title="The people behind the stories"
        description="Reporters, editors and specialists covering everything from global markets to design systems. Get to know them and read their latest work."
      />

      <ul className="grid gap-x-4 gap-y-12 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {writers.map((writer) => {
          return (
            <li key={writer.slug}>
              <Link href={`/writers/${writer.slug}`} className="group block">
                <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-surface">
                  <Image
                    src={writer.avatar}
                    alt={`Portrait of ${writer.name}`}
                    fill
                    sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}
