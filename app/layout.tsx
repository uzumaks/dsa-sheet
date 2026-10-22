import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const viewport: Viewport = {
  themeColor: "#101113",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const siteUrl = "https://dsasheeeet.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DSASheeeet | DSA Practice Tracker for Patterns and Companies",
    template: "%s | DSASheeeet",
  },
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
    title: "DSASheeeet | Your DSA Practice Workspace",
    description:
      "Explore DSA patterns and company-wise interview questions. Filter by topic and difficulty, track solved problems, save notes, and build a consistent interview preparation routine.",
    siteName: "DSASheeeet",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "DSASheeeet | Your DSA Practice Workspace (41 Patterns, 423 Companies)",
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
    images: ["/og-image.png"],
    creator: "@dsasheeeet",
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
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:secure_url" content="/og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/og-image.png" />
      </head>
      <body className="bg-[#101113] text-[#F3F4F6] min-h-screen antialiased selection:bg-emerald-900/40 selection:text-emerald-200">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
