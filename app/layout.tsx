import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#101113",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://dsa-tracker.local",
  ),
  title: {
    default: "DSA Tracker - 41 Patterns & 820 Curated LeetCode Problems",
    template: "%s | DSA Tracker",
  },
  description:
    "A minimal, dark-themed personal DSA problem tracker. Organize 41 high-ROI LeetCode patterns and 820 problems, track completions, and maintain offline autosaved approach notes.",
  applicationName: "DSA Tracker",
  keywords: [
    "DSA Tracker",
    "LeetCode Patterns",
    "Data Structures and Algorithms",
    "Coding Interview Preparation",
    "Two Pointers",
    "Sliding Window",
    "Dynamic Programming",
    "Binary Search",
    "Offline DSA Sheet",
  ],
  authors: [{ name: "Aayush Kashyap" }],
  creator: "Aayush Kashyap",
  publisher: "Aayush Kashyap",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "512x512", type: "image/png" },
    ],
  },
  openGraph: {
    title: "DSA Tracker - 41 Patterns & 820 Curated LeetCode Problems",
    description:
      "A quiet, distraction-free personal DSA problem tracker built for focused coding interview mastery. 41 patterns, 820 problems, offline autosaved notes.",
    siteName: "DSA Tracker",
    url: "/",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 675,
        alt: "DSA Tracker - 3D Smoked Glass and Titanium Curly Brackets with Emerald Constellations",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DSA Tracker - 41 Patterns & 820 Curated LeetCode Problems",
    description:
      "A quiet, distraction-free personal DSA problem tracker built for focused coding interview mastery. 41 patterns, 820 problems, offline autosaved notes.",
    images: ["/og-image.jpg"],
    creator: "@dsatracker",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-[#101113]">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-[#101113] text-[#F3F4F6] min-h-screen antialiased selection:bg-emerald-900/40 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
