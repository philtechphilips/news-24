import Image from "next/image";
import Link from "next/link";
import {
  BlogCard,
  CategoryTag,
  NewsListItem,
  PodcastCard,
  SectionHeader,
  TrendingCard,
  WriterCard,
} from "@/components/cards";
import SubscribeForm from "@/components/SubscribeForm";
import {
  featuredPosts,
  latestNews,
  popularBlogs,
  trendingPosts,
} from "@/lib/content";
import { podcasts, writers } from "@/lib/data";
import type { Post } from "@/lib/types";

export default function Home() {
  const [lead, ...sideStories] = featuredPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section aria-label="Featured stories" className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <FeatureTile post={lead} size="lg" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
          {sideStories.map((post) => (
            <FeatureTile key={post.slug} post={post} size="sm" />
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeader title="Latest News" />
        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {latestNews().map((post) => (
              <NewsListItem key={post.slug} post={post} />
            ))}
          </div>
          <div>
            <TrendingCard posts={trendingPosts()} />
          </div>
        </div>
        <Link
          href="/blogs"
          className="mt-6 inline-block rounded-sm border border-brand px-3 py-1.5 text-[11px] font-medium text-brand transition hover:bg-brand hover:text-white"
        >
          View All
        </Link>
      </section>

      <section className="mt-20">
        <SectionHeader title="Staff Writers" href="/writers" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {writers.slice(0, 4).map((writer) => (
            <WriterCard key={writer.slug} writer={writer} />
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeader title="Popular Blogs" href="/blogs" />
        <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {popularBlogs().map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeader title="Latest Podcast" />
        <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {podcasts.slice(0, 3).map((podcast) => (
            <PodcastCard key={podcast.slug} podcast={podcast} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/podcasts"
            className="inline-block rounded-sm bg-brand px-4 py-2 text-[11px] font-medium text-white transition hover:bg-brand-dark"
          >
            Browse All Podcasts
          </Link>
        </div>
      </section>

      <section
        id="subscribe"
        className="mt-24 scroll-mt-8 rounded-xl bg-night px-6 py-16 text-center text-white md:py-20"
      >
        <h2 className="mx-auto max-w-xl text-2xl leading-snug font-medium md:text-3xl">
          Get the news in front line by subscribe ✍️ our latest updates
        </h2>
        <div className="mt-8">
          <SubscribeForm variant="banner" />
        </div>
      </section>
    </div>
  );
}

function FeatureTile({ post, size }: { post: Post; size: "lg" | "sm" }) {
  const lg = size === "lg";
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={`group relative block overflow-hidden rounded-md bg-night ${
        lg ? "aspect-4/3 md:aspect-auto md:min-h-105" : "aspect-16/10 md:aspect-auto md:min-h-50.5"
      }`}
    >
      <Image
        src={post.image}
        alt={post.imageAlt}
        fill
        preload={lg}
        sizes={lg ? "(min-width: 768px) 740px, 100vw" : "(min-width: 768px) 370px, 50vw"}
        className="object-cover transition duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
      <span className={`absolute inset-x-0 bottom-0 ${lg ? "p-6 md:p-8" : "p-4"}`}>
        <CategoryTag slug={post.category} />
        <span
          className={`mt-3 block font-medium text-white ${
            lg ? "max-w-lg text-xl leading-snug md:text-2xl" : "text-xs leading-5"
          }`}
        >
          {post.title}
        </span>
      </span>
    </Link>
  );
}
