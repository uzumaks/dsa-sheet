import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DSA Tracker - Minimal LeetCode Pattern Sheet',
  description: 'A focused, distraction-free personal DSA problem tracker with topics, LeetCode links, and autosaved notes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-[#101113]">
      <body className="bg-[#101113] text-[#F3F4F6] min-h-screen antialiased selection:bg-emerald-900/40 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
