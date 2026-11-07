import type { Metadata } from "next";

const siteUrl = "https://dsasheeeet.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "DSASheeeet | DSA Practice Workspace for Patterns and Companies",
  description:
    "Master Data Structures and Algorithms with DSASheeeet, a focused DSA practice workspace featuring 41 patterns, 423 companies, and 17K+ company-wise problem entries. Track solved questions, organize practice by difficulty and topic, save personal notes, and monitor your progress in one distraction-free workspace.",
  applicationName: "DSASheeeet",
  keywords: [
    "DSASheeeet",
    "DSA Sheet",
    "DSA Tracker",
    "LeetCode Patterns",
    "Company Wise DSA",
    "Data Structures and Algorithms",
    "Coding Interview Preparation",
    "Two Pointers",
    "Sliding Window",
    "Dynamic Programming",
    "Binary Search",
    "Blind 75",
    "NeetCode Alternative",
  ],
  authors: [{ name: "Aayush Kashyap" }],
  creator: "Aayush Kashyap",
  publisher: "Aayush Kashyap",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: `${siteUrl}/home`,
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
    title: "DSASheeeet | Your DSA Practice Workspace",
    description:
      "Explore DSA patterns and company-wise interview questions. Filter by topic and difficulty, track solved problems, save notes, and build a consistent interview preparation routine.",
    siteName: "DSASheeeet",
    url: `${siteUrl}/home`,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "DSASheeeet | Your DSA Practice Workspace (41 Patterns, 423 Companies)",
      },
      {
        url: `${siteUrl}/og-banner.png`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "DSASheeeet Platform Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DSASheeeet | Your DSA Practice Workspace",
    description:
      "Explore DSA patterns and company-wise interview questions. Filter by topic and difficulty, track solved problems, save notes, and build a consistent interview preparation routine.",
    images: [`${siteUrl}/og-image.png`],
    creator: "@dsasheeeet",
    site: "@dsasheeeet",
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

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
