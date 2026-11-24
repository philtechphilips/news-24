import Link from "next/link";
import BlogShell from "@/components/BlogShell";
import {
  PodcastCard,
  PostGrid,
  SectionHeader,
  SpotlightCard,
  SpotlightLead,
  WriterCard,
} from "@/components/cards";
import { allPosts, spotlightPosts } from "@/lib/content";
import { podcasts, writers } from "@/lib/data";

export default function Home() {
  const spotlight = spotlightPosts();
  const [lead, ...cards] = spotlight;
  const latest = allPosts()
    .filter((p) => !spotlight.includes(p))
    .slice(0, 9);

  return (
    <BlogShell
      title="News & Stories"
      description="Dive into the stories shaping the world. Stay ahead with reporting and analysis on the economy, technology, style, art and much more."
    >
      <ul aria-label="Spotlight" className="grid gap-6 pb-12 md:grid-cols-3 md:gap-y-8 md:pb-24">
        <li className="md:col-span-3">
          <SpotlightLead post={lead} />
        </li>
        {cards.map((post) => (
          <li key={post.slug}>
            <SpotlightCard post={post} />
          </li>
        ))}
      </ul>

      <div className="space-y-16 md:space-y-24">
        <section>
          <SectionHeader title="Latest Posts" href="/blogs" />
          <PostGrid posts={latest} />
          <Link
            href="/blogs"
            className="mt-10 inline-flex rounded-full border border-ink px-5 py-3 text-[15px] font-medium transition-colors hover:bg-ink hover:text-white md:mt-14"
          >
            Browse all stories
          </Link>
        </section>

        <section>
          <SectionHeader title="Latest Podcasts" href="/podcasts" />
          <ul className="grid gap-y-10 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3">
            {podcasts.slice(0, 3).map((podcast) => (
              <li key={podcast.slug}>
                <PodcastCard podcast={podcast} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeader title="Staff Writers" href="/writers" />
          <ul className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {writers.slice(0, 4).map((writer) => (
              <li key={writer.slug}>
                <WriterCard writer={writer} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </BlogShell>
  );
}
