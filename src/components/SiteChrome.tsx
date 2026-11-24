import { searchIndex } from "@/lib/content";
import Footer from "./Footer";
import Header from "./Header";

/** Public site chrome: sticky header and the subscribe footer. */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header searchIndex={searchIndex()} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
