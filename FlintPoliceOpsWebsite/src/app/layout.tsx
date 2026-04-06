import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Flint Police Ops — Flint, MI Local News, Crime & Community",
  description:
    "Flint's #1 source for crime updates, local news, community events, and business spotlights. Stay informed, stay connected.",
  keywords: [
    "Flint",
    "Flint Michigan",
    "Flint news",
    "Flint crime",
    "Flint police",
    "Genesee County",
    "local news",
  ],
  openGraph: {
    title: "Flint Police Ops",
    description:
      "Flint's trusted source for crime updates, local news & community info.",
    type: "website",
    locale: "en_US",
    siteName: "Flint Police Ops",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
