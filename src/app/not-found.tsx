import NotFoundContent from "@/components/NotFoundContent";
import SiteChrome from "@/components/SiteChrome";

/** URLs that match no route render outside (site), so they bring their own chrome. */
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
