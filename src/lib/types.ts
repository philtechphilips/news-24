export type Category = {
  slug: string;
  name: string;
  description: string;
  /** Tailwind classes for the small category tag. */
  tagClass: string;
};

export type Writer = {
  slug: string;
  name: string;
  role: string;
  avatar: string;
  location: string;
  joined: string;
  bio: string[];
  beats: string[];
  social: { x?: string; instagram?: string; linkedin?: string };
};

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  category: string;
  writer: string;
  date: string;
  views: number;
  likes: number;
  featured?: boolean;
  trending?: boolean;
  body: Block[];
};

export type Comment = {
  id: string;
  parentId: string | null;
  author: string;
  body: string;
  date: string;
  likes: number;
};

export type Podcast = {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  host: string;
  date: string;
  duration: string;
  topics: string[];
  notes: string[];
};
