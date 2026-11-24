import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, SectionHeader, WriterCard } from "@/components/cards";
import { activeCategories } from "@/lib/content";
import { podcasts, posts, writers } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "News 24 is an independent publication for news, ideas and practical guides.",
};

export default function AboutPage() {
  const stats = [
    { label: "Stories published", value: posts.length },
    { label: "Staff writers", value: writers.length },
    { label: "Topics covered", value: activeCategories().length },
    { label: "Podcast episodes", value: podcasts.length },
  ];

  return (
    <div className="page-shell pb-24 md:pb-32">
      <PageIntro
        eyebrow="About News 24"
        title="News in the front line, explained clearly"
        description="News 24 is an independent publication covering the economy, world affairs, technology, culture and design. We believe good journalism should be accurate, readable and open to conversation, which is why every story invites your comments."
      />

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white px-6 py-8">
            <dd className="font-display text-5xl">{stat.value}</dd>
            <dt className="mt-2 text-xs text-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <section className="mt-20 grid gap-10 md:grid-cols-3">
        {[
          {
            title: "Accurate",
            text: "Every story is checked by an editor before it goes live, and we correct mistakes openly.",
          },
          {
            title: "Readable",
            text: "We explain complex topics in plain language, without dumbing them down.",
          },
          {
            title: "Open",
            text: "Readers can comment, reply and like stories. The conversation is part of the journalism.",
          },
        ].map((value) => (
          <div key={value.title} className="border-t-2 border-brand pt-5">
            <h2 className="font-display text-2xl">{value.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{value.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-20">
        <SectionHeader title="Meet the team" href="/writers" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {writers.slice(0, 4).map((writer) => (
            <WriterCard key={writer.slug} writer={writer} />
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-xl bg-surface p-8 md:p-12">
        <h2 className="font-display text-3xl">Get in touch</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
          Have a tip, a correction or an idea for a story? We read every message.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="mailto:info@news24.com"
            className="rounded-full bg-ink px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-brand"
          >
            info@news24.com
          </a>
          <Link
            href="/#subscribe"
            className="rounded-full border border-ink px-5 py-3 text-[15px] font-medium transition-colors hover:bg-ink hover:text-white"
          >
            Subscribe to updates
          </Link>
        </div>
      </section>
    </div>
  );
}
