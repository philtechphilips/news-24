import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { allPosts, getCategory } from "@/lib/content";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "News 24 — News, stories and ideas",
    template: "%s · News 24",
  },
  description:
    "News 24 brings you the latest news, in-depth blogs, staff writers and podcasts on economy, style, art, technology and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const searchIndex = allPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    image: p.image,
    category: getCategory(p.category)?.name ?? "",
  }));

  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header searchIndex={searchIndex} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
