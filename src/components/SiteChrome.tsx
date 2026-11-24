import { getBlog } from "@/lib/blog";
import { searchIndex } from "@/lib/content";
import Footer from "./Footer";
import Header from "./Header";

/** Public site chrome: sticky header and the subscribe footer. */
export default async function SiteChrome({ children }: { children: React.ReactNode }) {
  // If the API is down, the header still renders; search just has nothing to find.
  const index = await getBlog()
    .then(searchIndex)
    .catch(() => []);
  return (
    <>
      <Header searchIndex={index} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
