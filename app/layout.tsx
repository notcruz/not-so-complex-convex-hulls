import LayoutProvider from "@/components/layout-provider";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Not So Complex Convex Hulls",
  description:
    "A teaching tool that visualizes step-by-step execution of convex hull algorithms on different point sets, helping users understand how each algorithm makes decisions. Perfect for students learning computational geometry.",
  authors: [
    { name: "Jonathan Cruz", url: "https://notjoncruz.dev" },
    { name: "Lucas Romero" },
  ],
  keywords: ["Convex Hulls", "CSCI 716", "RIT"],
};

export const viewport: Viewport = {
  themeColor: "#F76902",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head />
      <LayoutProvider>{children}</LayoutProvider>
    </html>
  );
}
