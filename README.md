# News 24 — Modern Publishing Platform

## Overview

News 24 is a modern online newsroom that lets a publication publish stories, manage writers and podcasts, and talk with readers in real time. It gives editorial teams a clean dashboard to write and publish content, while giving readers fast search, comments, and social sharing. Everything is built for speed, accessibility, and a great reading experience on any device.

```mermaid
flowchart LR
    Reader["Public Reader"]
    Editor["Editor / Admin"]
    Next["Next.js App"]
    Admin["Admin Dashboard"]
    API["Backend API"]
    DB[("Database")]
    SSE["Live Updates"]

    Reader --> Next
    Editor --> Admin
    Next --> API
    Admin --> API
    API --> DB
    Next --> SSE

    style Next fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#fff
    style Admin fill:#2e1065,stroke:#8b5cf6,stroke-width:2px,color:#fff
    style API fill:#2e1065,stroke:#8b5cf6,stroke-width:2px,color:#fff
    style DB fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff
    style Reader fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#fff
    style Editor fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#fff
    style SSE fill:#022c22,stroke:#10b981,stroke-width:2px,color:#fff
```

## Features

### Public News Site

A fast, responsive site with a homepage, blog index, category pages, writer profiles, podcast pages, and an about page. Each page uses static generation where it makes sense, so the site stays quick.

### Real-Time Comments and Engagement

Readers can like posts, leave comments, reply to each other, and see new activity appear live without refreshing. The frontend proxies a Server-Sent Events stream from the backend so real-time updates reach the browser safely.

```mermaid
sequenceDiagram
    actor Reader
    participant Browser
    participant NextAPI as "Next.js API"
    participant Backend as "Backend API"

    Reader->>Browser: Opens article
    Browser->>NextAPI: GET /api/posts/[id]/engagement
    NextAPI->>Backend: Fetch comments and likes
    Backend-->>NextAPI: Engagement snapshot
    NextAPI-->>Browser: Render comments
    Browser->>NextAPI: GET /api/posts/[id]/live (SSE)
    NextAPI->>Backend: Open SSE stream
    loop As comments arrive
        Backend-->>NextAPI: New comment event
        NextAPI-->>Browser: Update comments live
    end
```

### Admin Dashboard

Editors can create and edit posts, manage categories, and handle user roles. The dashboard shows live stats, a post list with filters, and inline forms with validation.

```mermaid
sequenceDiagram
    actor Editor
    participant Admin as "Admin UI"
    participant Actions as "Server Actions"
    participant Backend as "Backend API"

    Editor->>Admin: Writes new post
    Admin->>Actions: Submit savePost form
    Actions->>Backend: POST /posts/
    Backend-->>Actions: Saved post
    Actions->>Admin: Revalidate and redirect
    Admin->>Editor: Shows saved confirmation
```

### Search

A site-wide search overlay lets readers find posts as they type. Search results come from the backend through a Next.js API route, so the API base URL never needs to be exposed to the browser.

## Installation

1. **Clone the repository**

```bash
git clone git@github.com:philtechphilips/news-24.git
cd news-24
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file at the root:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.example.com
```

The app also needs the backend API to be running. Point `NEXT_PUBLIC_API_URL` to your API instance.

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**

```bash
npm run build
npm start
```

## Usage

Once the app is running, you can:

- Browse the public site at `/`
- View all stories at `/blogs`
- Filter by category at `/category/[slug]`
- Read writer profiles at `/writers/[slug]`
- Listen to podcasts at `/podcasts/[slug]`
- Access the admin dashboard at `/admin` (admin account required)

The admin area supports:

- Creating and editing posts with markdown-style body input
- Publishing or saving drafts
- Managing categories
- Managing users and admin roles

## API Documentation

The project includes several Next.js API routes that proxy requests to the backend.

### GET /api/posts?page=N

Fetches a paginated page of published posts.

**Request**:

```text
GET /api/posts?page=2
```

**Response**:

```json
{
  "page": 2,
  "pageCount": 5,
  "posts": [
    {
      "slug": "sample-post",
      "title": "Sample Post",
      "excerpt": "A short summary...",
      "image": "https://images.unsplash.com/photo-...",
      "categoryName": "Technology"
    }
  ]
}
```

**Errors**:

- `400`: Page parameter is not a positive integer
- `502`: Backend posts service is unavailable

---

### GET /api/search?q=...

Searches published posts through the backend by title, excerpt, body, and category name.

**Request**:

```text
GET /api/search?q=markets
```

**Response**:

```json
[
  {
    "slug": "fed-rate-decision",
    "title": "Fed Rate Decision",
    "image": "https://...",
    "category": "Economy"
  }
]
```

**Errors**:

- `502`: Backend search service is unavailable

---

### GET /api/posts/:id/engagement

Returns a post's comments, like/share counts, and the current viewer's state.

**Request**:

```text
GET /api/posts/123e4567-e89b-12d3-a456-426614174000/engagement
```

**Response**:

```json
{
  "comments": [],
  "likes": 42,
  "shares": 7,
  "viewer": {
    "id": "user-uuid",
    "name": "Jane Doe",
    "isAdmin": false
  }
}
```

**Errors**:

- `404`: Post not found or invalid UUID
- `502`: Engagement service is unavailable

---

### GET /api/posts/:id/live

Opens a Server-Sent Events stream for live comments, likes, and shares on a post.

**Request**:

```text
GET /api/posts/123e4567-e89b-12d3-a456-426614174000/live
```

**Response**:

Stream of SSE events containing live engagement updates.

**Errors**:

- `404`: Post not found or invalid UUID
- `502`: Live updates service is unavailable

## Technologies Used

| Technology | Description |
|---|---|
| [Next.js](https://nextjs.org/) | React framework for production-grade apps |
| [React](https://react.dev/) | UI library for building component-based interfaces |
| [TypeScript](https://www.typescriptlang.org/) | Typed JavaScript for safer code |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [ESLint](https://eslint.org/) | Linting for code quality |

## Contributing

Contributions are welcome. If you would like to improve the project, feel free to open an issue or pull request. For detailed guidelines, check the repository issue tracker.

## Author

Built with care by **Pelumi Isola**.

- [LinkedIn](https://linkedin.com/in/Pelumi Isola)
- [X (Twitter)](https://x.com/softwareengng)

## Badges

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://dokugen.samueltuoyo.com)