import { activeCategories, searchIndex } from "@/lib/content";
import BlogSidebar from "./BlogSidebar";

/** Sticky sidebar (title, search, topics) beside a three-column main area. */
export default function BlogShell({
  title,
  description,
  activeTopic,
  children,
}: {
  title: string;
  description: string;
  activeTopic?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="page-shell grid gap-y-8 pt-10 pb-16 md:grid-cols-4 md:gap-x-6 md:pt-18 md:pb-36">
      <div>
        <BlogSidebar
          title={title}
          description={description}
          activeTopic={activeTopic}
          topics={activeCategories().map(({ slug, name }) => ({ slug, name }))}
          searchIndex={searchIndex()}
        />
      </div>
      <div className="min-w-0 md:col-span-3">{children}</div>
    </section>
  );
}
