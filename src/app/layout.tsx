import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Samvaad — AI Interview Practice",
  description: "Practice system design interviews with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  );
}
