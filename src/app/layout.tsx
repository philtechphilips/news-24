import type { Metadata } from "next";
import { Inter, Varela_Round } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { searchIndex } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const varela = Varela_Round({
  variable: "--font-varela",
  subsets: ["latin"],
  weight: "400",
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
  return (
    <html lang="en" className={`${inter.variable} ${varela.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header searchIndex={searchIndex()} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
