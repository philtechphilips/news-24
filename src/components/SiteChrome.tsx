import { getBlog } from "@/lib/blog";
import { searchIndex } from "@/lib/content";
import Footer from "./Footer";
import Header from "./Header";

/** Public site chrome: sticky header and the subscribe footer. */
export default async function SiteChrome({ children }: { children: React.ReactNode }) {
  // The five newest stories the search dialog shows before anything is typed.
  // If the API is down the header still renders, just without them.
  const latest = await getBlog()
    .then((blog) => searchIndex(blog).slice(0, 5))
    .catch(() => []);
  return (
    <>
      <Header latest={latest} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
