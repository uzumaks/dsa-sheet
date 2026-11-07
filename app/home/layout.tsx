import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DSASheeeet | DSA Practice Workspace for Patterns and Companies",
  description:
    "Master Data Structures and Algorithms with DSASheeeet, a focused DSA practice workspace featuring 41 patterns, 423 companies, and 17K+ company-wise problem entries. Track solved questions, organize practice by difficulty and topic, save personal notes, and monitor your progress in one distraction-free workspace.",
  openGraph: {
    title: "DSASheeeet | Your DSA Practice Workspace",
    description:
      "Explore DSA patterns and company-wise interview questions. Filter by topic and difficulty, track solved problems, save notes, and build a consistent interview preparation routine.",
    siteName: "DSASheeeet",
    url: "/home",
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

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
