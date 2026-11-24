import type { Category, Comment } from "./types";

const sampleCategories: Category[] = [
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

export const seedComments: Record<string, Comment[]> = {
  "markets-money-and-global-economies": [
    {
      id: "seed-1",
      parentId: null,
      author: "Tunde Bakare",
      body: "Really clear explanation of how rate decisions filter down to households. The point about eighteen-month bets stuck with me.",
      date: "2026-10-21",
      likes: 14,
    },
    {
      id: "seed-2",
      parentId: "seed-1",
      author: "Grace Lin",
      body: "Same here. I'd love a follow-up on what this means for first-time home buyers.",
      date: "2026-10-21",
      likes: 6,
    },
    {
      id: "seed-3",
      parentId: null,
      author: "Samuel Ortiz",
      body: "Nearshoring is already visible where I work. Two of our suppliers moved production closer this year.",
      date: "2026-10-22",
      likes: 3,
    },
  ],
  "build-a-scalable-design-system-from-scratch": [
    {
      id: "seed-4",
      parentId: null,
      author: "Priya Nair",
      body: "Starting with tokens saved our team months. Great advice on not over-designing for the future.",
      date: "2026-10-11",
      likes: 22,
    },
    {
      id: "seed-5",
      parentId: "seed-4",
      author: "Leo Martins",
      body: "Did you sync tokens to code automatically or by hand at first?",
      date: "2026-10-12",
      likes: 4,
    },
    {
      id: "seed-6",
      parentId: "seed-5",
      author: "Priya Nair",
      body: "By hand for the first few weeks, then we automated it once the names settled down.",
      date: "2026-10-12",
      likes: 7,
    },
  ],
  "tech-giants-unveil-next-generation-ai-assistants": [
    {
      id: "seed-7",
      parentId: null,
      author: "Hannah Reid",
      body: "The confirmation step before important actions is the part I care about most. Good to see it mentioned.",
      date: "2026-10-21",
      likes: 9,
    },
  ],
};
