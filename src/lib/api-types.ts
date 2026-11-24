/** Shapes returned by the FastAPI backend. Safe to import from client components. */

export type Role = "user" | "admin";

export type ApiUser = {
  id: string;
  email: string;
  /** Shown on their comments; null until they set one. */
  name: string | null;
  role: Role;
  created_at: string;
};

export type ApiCategory = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type ApiPost = {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  featured_image: string | null;
  tags: string[];
  is_published: boolean;
  category_id: string | null;
  writer_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiWriter = {
  id: string;
  name: string;
  slug: string;
  role: string;
  avatar: string | null;
  location: string | null;
  joined: string | null;
  bio: string[];
  beats: string[];
  social: { x?: string; instagram?: string; linkedin?: string };
};

export type ApiPodcast = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string | null;
  audio_url: string | null;
  duration_minutes: number | null;
  topics: string[];
  notes: string[];
  is_published: boolean;
  host_id: string | null;
  created_at: string;
};

export type ApiComment = {
  id: string;
  post_id: string;
  /** Set on replies. */
  parent_id: string | null;
  body: string;
  created_at: string;
  author: { id: string; name: string };
  likes: number;
};

export type ApiPostStats = { likes: number; comments: number; shares: number };

/** GET /posts/{id}/engagement */
export type ApiEngagement = {
  stats: ApiPostStats;
  /** Oldest first. */
  comments: ApiComment[];
  liked: boolean;
  liked_comments: string[];
};

export type ApiLikeResult = { liked: boolean; likes: number };

/** Who is reading, as far as the comments section needs to know. */
export type Viewer = { id: string; name: string | null; isAdmin: boolean };

/** GET /api/posts/{id}/engagement: the backend's engagement plus the viewer. */
export type EngagementSnapshot = ApiEngagement & { viewer: Viewer | null };

/** What a form action returns: a banner message and/or per-field messages. */
export type FormState = {
  ok?: boolean;
  message?: string;
  error?: string;
  fields?: Record<string, string>;
};
