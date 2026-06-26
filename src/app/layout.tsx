import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "粵語 Cantonese Flashcards",
  description:
    "Study the 2,100 most common Cantonese words with Sidney Lau romanisation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
