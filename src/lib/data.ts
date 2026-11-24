import type { Category } from "./types";

const sampleCategories: Omit<Category, "id">[] = [
  {
    slug: "economy",
    name: "Economy",
    description: "Markets, money and the forces shaping the global economy.",
  },
  {
    slug: "style",
    name: "Style",
    description: "Fashion, trends and the culture of how we look and live.",
  },
  {
    slug: "art",
    name: "Art",
    description: "Artists, exhibitions and the stories behind creative work.",
  },
  {
    slug: "world",
    name: "World News",
    description: "Reporting from around the globe on the stories that matter.",
  },
  {
    slug: "technology",
    name: "Technology",
    description: "AI, security and the products changing how we work.",
  },
  {
    slug: "sports",
    name: "Sports",
    description: "Results, records and the athletes behind them.",
  },
  {
    slug: "science",
    name: "Science",
    description: "Discoveries from labs, field work and research teams.",
  },
  {
    slug: "politics",
    name: "Politics",
    description: "Elections, policy and the people in power.",
  },
  {
    slug: "health",
    name: "Health",
    description: "Public health, medicine and living well.",
  },
  {
    slug: "entertainment",
    name: "Entertainment",
    description: "Film, television, music and the people who make them.",
  },
  {
    slug: "design",
    name: "Design",
    description: "Product design, UX and building things people love to use.",
  },
];

/** Descriptions shown on category pages, matched to API categories by name. */
export const categoryDescriptions: Record<string, string> = Object.fromEntries(
  sampleCategories.map((c) => [c.name, c.description]),
);
