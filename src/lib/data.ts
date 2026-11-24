import type { Category, Comment, Podcast, Writer } from "./types";

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

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

export const writers: Writer[] = [
  {
    slug: "kristin-watson",
    name: "Kristin Watson",
    role: "Senior Writer",
    avatar: img("1573496359142-b8d87734a5a2", 800),
    location: "New York, USA",
    joined: "2019-03-04",
    bio: [
      "Kristin covers the global economy, from central bank decisions to the small businesses that feel them first. Before joining News 24 she spent six years on a markets desk, translating dense financial data into stories readers can act on.",
      "She is happiest with a spreadsheet open and a source on the phone, and believes every economic story is ultimately a story about people.",
    ],
    beats: ["Economy", "Markets", "Global trade"],
    social: { x: "https://x.com", linkedin: "https://linkedin.com" },
  },
  {
    slug: "marvin-roy",
    name: "Marvin Roy",
    role: "Journalist",
    avatar: img("1519085360753-af0119f7cbe7", 800),
    location: "London, UK",
    joined: "2020-08-17",
    bio: [
      "Marvin reports on world affairs and politics, with a focus on climate policy and international negotiations. He has covered summits on four continents and still keeps a notebook for every one.",
      "His reporting has been recognised for its clarity on complex policy fights, and he hosts the occasional live Q&A with readers.",
    ],
    beats: ["World News", "Politics", "Climate"],
    social: { x: "https://x.com", instagram: "https://instagram.com" },
  },
  {
    slug: "leslie-aria",
    name: "Leslie Aria",
    role: "Publisher",
    avatar: img("1580489944761-15a19d654956", 800),
    location: "Lagos, Nigeria",
    joined: "2018-01-09",
    bio: [
      "Leslie leads News 24's editorial direction and writes about art, culture and the creative economy. She founded the publication's arts desk and has commissioned hundreds of features from emerging writers.",
      "When she is not editing, she is visiting galleries and studios in search of the next story worth telling.",
    ],
    beats: ["Art", "Culture", "Creative economy"],
    social: {
      x: "https://x.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    slug: "hawkings-alex",
    name: "Hawkings Alex",
    role: "Content Writer",
    avatar: img("1507003211169-0a1dd7228f2d", 800),
    location: "Toronto, Canada",
    joined: "2021-05-22",
    bio: [
      "Hawkings writes about digital publishing, SEO and growing an audience online. He has helped dozens of independent blogs turn into sustainable businesses and shares what works, and what doesn't, in plain language.",
      "He also co-hosts the News 24 podcast on building a voice on the web.",
    ],
    beats: ["Blogging", "SEO", "Social media"],
    social: { x: "https://x.com", linkedin: "https://linkedin.com" },
  },
  {
    slug: "jenny-wilson",
    name: "Jenny Wilson",
    role: "Style Editor",
    avatar: img("1534528741775-53994a69daeb", 800),
    location: "Paris, France",
    joined: "2020-02-11",
    bio: [
      "Jenny edits the Style section, covering fashion weeks, independent designers and the business of what we wear.",
      "She is particularly interested in sustainable fashion and the makers rethinking how clothes are produced.",
    ],
    beats: ["Style", "Fashion", "Sustainability"],
    social: { instagram: "https://instagram.com" },
  },
  {
    slug: "daniel-okafor",
    name: "Daniel Okafor",
    role: "Tech Correspondent",
    avatar: img("1506794778202-cad84cf45f1d", 800),
    location: "San Francisco, USA",
    joined: "2022-04-03",
    bio: [
      "Daniel covers artificial intelligence, cybersecurity and the companies building the next generation of software.",
      "A former engineer, he likes to read the documentation before the press release.",
    ],
    beats: ["Technology", "AI", "Security"],
    social: { x: "https://x.com", linkedin: "https://linkedin.com" },
  },
  {
    slug: "amara-chen",
    name: "Amara Chen",
    role: "Design Writer",
    avatar: img("1544005313-94ddf0286df2", 800),
    location: "Singapore",
    joined: "2021-10-28",
    bio: [
      "Amara writes about product design, UX and design systems. She spent eight years designing apps used by millions before switching to writing about the craft full time.",
      "Her guides are known for being practical: every article ends with something you can try the same day.",
    ],
    beats: ["Design", "UX", "Design systems"],
    social: { x: "https://x.com", instagram: "https://instagram.com" },
  },
  {
    slug: "robert-fox",
    name: "Robert Fox",
    role: "Sports Reporter",
    avatar: img("1500648767791-00dcc994a43e", 800),
    location: "Melbourne, Australia",
    joined: "2019-11-15",
    bio: [
      "Robert covers athletics, football and the science of performance. He has reported from three Olympic Games and countless muddy touchlines.",
      "He also writes about health and fitness for everyday athletes.",
    ],
    beats: ["Sports", "Athletics", "Health"],
    social: { x: "https://x.com" },
  },
];

export const podcasts: Podcast[] = [
  {
    slug: "social-media-power",
    title: "Social Media Power: Amplifying Your Blog's Reach",
    description:
      "Learn how to leverage social media platforms to increase blog traffic and engagement.",
    image: img("1593642632559-0c6d3fc62b89"),
    imageAlt: "Laptop on a bright desk by a window",
    host: "hawkings-alex",
    date: "2026-10-14",
    duration: "38 min",
    topics: ["Social media", "Audience growth", "Content strategy"],
    notes: [
      "Choosing the two platforms that matter for your audience.",
      "Turning one article into a week of social posts.",
      "How to measure what's actually driving readers.",
    ],
  },
  {
    slug: "seo-mastery",
    title: "SEO Mastery: How to Rank Higher on Google",
    description:
      "Get expert SEO tips to improve your blog's visibility and ranking.",
    image: img("1460925895917-afdab827c52f"),
    imageAlt: "Laptop showing an analytics dashboard",
    host: "hawkings-alex",
    date: "2026-10-07",
    duration: "45 min",
    topics: ["SEO", "Keywords", "Analytics"],
    notes: [
      "Finding keywords your readers actually search for.",
      "Writing titles and descriptions that earn the click.",
      "Technical basics: speed, structure and internal links.",
    ],
  },
  {
    slug: "monetizing-your-blog",
    title: "Monetizing Your Blog: Turning Passion Into Profit",
    description:
      "Explore top strategies for making money from your blog.",
    image: img("1590602847861-f357a9332bbc"),
    imageAlt: "Studio microphone on a boom arm",
    host: "kristin-watson",
    date: "2026-09-30",
    duration: "41 min",
    topics: ["Monetization", "Newsletters", "Sponsorships"],
    notes: [
      "Ads, affiliates, memberships: which model fits your blog.",
      "Pricing your first sponsorship.",
      "Building a newsletter readers will pay for.",
    ],
  },
  {
    slug: "inside-the-newsroom",
    title: "Inside the Newsroom: How a Story Gets Made",
    description:
      "From the first tip to publication, our editors walk through the life of a story.",
    image: img("1478737270239-2f02b77fc618"),
    imageAlt: "Microphone in a dimly lit recording studio",
    host: "leslie-aria",
    date: "2026-09-23",
    duration: "52 min",
    topics: ["Journalism", "Editing", "Fact-checking"],
    notes: [
      "How editors decide which stories to pursue.",
      "Verifying sources and checking facts.",
      "The final read before a story goes live.",
    ],
  },
  {
    slug: "design-for-everyone",
    title: "Design for Everyone: Accessibility in Practice",
    description:
      "Practical ways to make websites and apps work for every reader.",
    image: img("1557672172-298e090bd0f1"),
    imageAlt: "Abstract pink and blue fluid paint",
    host: "amara-chen",
    date: "2026-09-16",
    duration: "36 min",
    topics: ["Accessibility", "UX", "Inclusive design"],
    notes: [
      "Colour contrast and readable type.",
      "Designing for keyboard and screen reader users.",
      "Testing accessibility without special tools.",
    ],
  },
  {
    slug: "future-of-work-with-ai",
    title: "The Future of Work with AI",
    description:
      "What AI assistants will change about our jobs, and what they won't.",
    image: img("1485827404703-89b55fcc595e"),
    imageAlt: "Small white humanoid robot",
    host: "daniel-okafor",
    date: "2026-09-09",
    duration: "47 min",
    topics: ["AI", "Careers", "Productivity"],
    notes: [
      "Which tasks AI handles well today.",
      "Skills that become more valuable, not less.",
      "How teams are adopting AI responsibly.",
    ],
  },
];

/** Sample comments every visitor sees; comments people add are kept in their browser. */
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
