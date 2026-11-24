import type { Metadata } from "next";
import { PageIntro, PodcastCard } from "@/components/cards";
import { podcasts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Podcasts",
  description: "Conversations on blogging, design, journalism and technology.",
};

export default function PodcastsPage() {
  return (
    <div className="page-shell pb-24 md:pb-32">
      <PageIntro
        eyebrow="Podcasts"
        title="Listen to News 24"
        description="Conversations with our writers and guests on growing an audience, designing better products and how the news gets made."
      />
      <div className="grid gap-x-4 gap-y-12 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
        {podcasts.map((podcast) => (
          <PodcastCard key={podcast.slug} podcast={podcast} />
        ))}
      </div>
    </div>
  );
}
