"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Search,
  Zap,
  HardDrive,
  ChevronRight,
  ArrowUpRight,
  Code2,
  Building2,
  FileText,
  Check,
  Sparkles,
} from "lucide-react";

interface MockProblem {
  id: string;
  number: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  url: string;
  solved: boolean;
  notes?: string;
  companies: string[];
}

const INITIAL_PROBLEMS: MockProblem[] = [
  {
    id: "p-3",
    number: "003",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Sliding Window",
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    solved: true,
    notes: "Two pointers with last seen index map. Shrink window when duplicate occurs.",
    companies: ["Google", "Amazon", "Meta", "Microsoft"],
  },
  {
    id: "p-76",
    number: "076",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    topic: "Sliding Window",
    url: "https://leetcode.com/problems/minimum-window-substring/",
    solved: false,
    notes: "Maintain frequency count and matched character quota. Expand right, shrink left.",
    companies: ["Meta", "Google", "Uber"],
  },
  {
    id: "p-424",
    number: "424",
    title: "Longest Repeating Character Replacement",
    difficulty: "Medium",
    topic: "Sliding Window",
    url: "https://leetcode.com/problems/longest-repeating-character-replacement/",
    solved: true,
    companies: ["Amazon", "Uber", "Apple"],
  },
  {
    id: "p-11",
    number: "011",
    title: "Container With Most Water",
    difficulty: "Medium",
    topic: "Two Pointers",
    url: "https://leetcode.com/problems/container-with-most-water/",
    solved: false,
    companies: ["Google", "Amazon", "Adobe"],
  },
  {
    id: "p-42",
    number: "042",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    topic: "Two Pointers",
    url: "https://leetcode.com/problems/trapping-rain-water/",
    solved: true,
    notes: "Two pointers tracking leftMax and rightMax, or monotonic decreasing stack.",
    companies: ["Google", "Amazon", "Meta", "Goldman Sachs"],
  },
];

const PATTERN_MATRIX = [
  {
    name: "Sliding Window",
    roi: "High ROI",
    roiColor: "emerald",
    count: 14,
    complexity: "O(n) time, O(k) space",
    coreIdea: "Dynamic or fixed-size boundary expansion for contiguous sub-arrays.",
    canonical: "003. Longest Substring Without Repeating Characters",
  },
  {
    name: "Two Pointers",
    roi: "High ROI",
    roiColor: "emerald",
    count: 22,
    complexity: "O(n) time, O(1) space",
    coreIdea: "Opposite or same-direction pointers reducing quadratic searches to linear.",
    canonical: "042. Trapping Rain Water",
  },
  {
    name: "Monotonic Stack",
    roi: "High ROI",
    roiColor: "emerald",
    count: 11,
    complexity: "O(n) time, O(n) space",
    coreIdea: "Order-preserved stack to resolve next greater or smaller element in one pass.",
    canonical: "084. Largest Rectangle in Histogram",
  },
  {
    name: "Binary Search Variations",
    roi: "Essential",
    roiColor: "blue",
    count: 18,
    complexity: "O(log n) time, O(1) space",
    coreIdea: "Monotonic predicate search space, lower bounds, and rotated arrays.",
    canonical: "033. Search in Rotated Sorted Array",
  },
  {
    name: "Prefix Sum & Hash Map",
    roi: "Essential",
    roiColor: "blue",
    count: 16,
    complexity: "O(n) time, O(n) space",
    coreIdea: "Accumulative sums paired with hash frequencies for subarray target lookups.",
    canonical: "560. Subarray Sum Equals K",
  },
  {
    name: "Dynamic Programming (1D & 2D)",
    roi: "Advanced",
    roiColor: "amber",
    count: 36,
    complexity: "O(n*k) time, O(n) space",
    coreIdea: "Optimal substructure and overlapping subproblems with memoized state transitions.",
    canonical: "300. Longest Increasing Subsequence",
  },
];

const COMPANY_PREVIEWS = [
  {
    name: "Google",
    totalProblems: 312,
    solvedMock: 14,
    frequency: "Very High",
    topTopic: "Graphs & DP",
  },
  {
    name: "Amazon",
    totalProblems: 428,
    solvedMock: 21,
    frequency: "Highest",
    topTopic: "Sliding Window & Trees",
  },
  {
    name: "Meta",
    totalProblems: 295,
    solvedMock: 19,
    frequency: "Very High",
    topTopic: "Arrays & Two Pointers",
  },
  {
    name: "Microsoft",
    totalProblems: 240,
    solvedMock: 9,
    frequency: "High",
    topTopic: "Strings & LinkedLists",
  },
  {
    name: "Uber",
    totalProblems: 184,
    solvedMock: 7,
    frequency: "High",
    topTopic: "Intervals & Graphs",
  },
  {
    name: "Apple",
    totalProblems: 162,
    solvedMock: 4,
    frequency: "Moderate",
    topTopic: "Design & Arrays",
  },
  {
    name: "Goldman Sachs",
    totalProblems: 210,
    solvedMock: 8,
    frequency: "High",
    topTopic: "DP & Trees",
  },
  {
    name: "Stripe",
    totalProblems: 134,
    solvedMock: 5,
    frequency: "High",
    topTopic: "Hash Maps & Strings",
  },
];

export default function LandingPage() {
  const [mockProblems, setMockProblems] = useState<MockProblem[]>(INITIAL_PROBLEMS);
  const [activePatternIndex, setActivePatternIndex] = useState(0);
  const [companySearch, setCompanySearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "solved" | "unsolved">("all");

  const toggleProblem = (id: string) => {
    setMockProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, solved: !p.solved } : p))
    );
  };

  const solvedCount = mockProblems.filter((p) => p.solved).length;
  const totalCount = mockProblems.length;
  const progressPercent = Math.round((solvedCount / totalCount) * 100);

  const filteredCompanyList = useMemo(() => {
    if (!companySearch.trim()) return COMPANY_PREVIEWS;
    return COMPANY_PREVIEWS.filter((c) =>
      c.name.toLowerCase().includes(companySearch.toLowerCase())
    );
  }, [companySearch]);

  const filteredProblems = useMemo(() => {
    if (activeTab === "solved") return mockProblems.filter((p) => p.solved);
    if (activeTab === "unsolved") return mockProblems.filter((p) => !p.solved);
    return mockProblems;
  }, [activeTab, mockProblems]);

  return (
    <div className="font-pretty fixed inset-0 overflow-y-auto bg-[#101113] text-[#F3F4F6] custom-scrollbar selection:bg-emerald-950/70 selection:text-emerald-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full bg-[#101113]/85 backdrop-blur-md border-b border-[#25272C]">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 h-16 2xl:h-20 flex items-center justify-between">
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer transition-opacity hover:opacity-90"
              title="Go to Practice Workspace"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#17181B] border border-[#292A2E] flex items-center justify-center text-xs sm:text-sm font-semibold text-emerald-400 tracking-wider transition-colors group-hover:border-emerald-500/50">
                {"{ }"}
              </div>
              <span className="font-pretty font-[300] text-base sm:text-lg text-gray-100 tracking-wide select-none">
                DSASheeeet
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-pretty-mono font-[300] text-emerald-400">
              V1.1.1
            </span>
          </div>

            {/* Links */}
            <nav className="hidden md:flex items-center gap-8 2xl:gap-10 text-sm 2xl:text-base font-[300] text-gray-400">
              <a
                href="#patterns"
                className="hover:text-gray-100 transition-colors tracking-wide"
              >
                41 Patterns
              </a>
              <a
                href="#companies"
                className="hover:text-gray-100 transition-colors tracking-wide"
              >
                423 Companies
              </a>
              <a
                href="#offline"
                className="hover:text-gray-100 transition-colors tracking-wide"
              >
                Architecture
              </a>
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="relative inline-flex items-center justify-center gap-1.5 px-4 py-2 2xl:px-5 2xl:py-2.5 rounded-md bg-emerald-500/90 text-[#101113] font-[400] text-xs sm:text-sm 2xl:text-base tracking-wide transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98] shadow-sm shadow-emerald-950/40"
              >
                <span>Launch Workspace</span>
                <ArrowUpRight className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 stroke-[1.5]" />
              </Link>
            </div>
          </div>
        </header>

        {/* Main Sections */}
        <main className="w-full">
          {/* SCREEN 1: HERO & LIVE WORKSPACE PREVIEW */}
          <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 lg:py-16 2xl:py-20 w-full max-w-[1920px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 2xl:gap-16 items-center">
              {/* Left Column: Extra-thin Title and Quiet Hierarchy */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-xs 2xl:text-sm font-pretty-mono font-[300] tracking-widest text-emerald-400/90 uppercase mb-4">
                  <span className="w-2 h-[1px] bg-emerald-400" />
                  Focused Interview Preparation
                </div>

                {/* Extra thin + thin title pairing */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-[150] text-gray-100 tracking-tight leading-[1.08] mb-6">
                  The DSA practice workspace{" "}
                  <span className="font-[300] text-gray-300 block mt-1">
                    for patterns and companies.
                  </span>
                </h1>

                {/* Refined subtitle in thin font */}
                <p className="text-gray-400 font-[300] text-base sm:text-lg 2xl:text-xl leading-relaxed mb-8 max-w-xl 2xl:max-w-2xl">
                  Master 41 algorithmic patterns and 423 company problem sets in one
                  distraction-free, offline-first workspace. Zero sign-up walls, zero
                  telemetry, and instantaneous local persistence.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 2xl:px-7 2xl:py-3.5 rounded-md bg-emerald-500/90 text-[#101113] font-[400] text-sm 2xl:text-base tracking-wide transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98]"
                  >
                    <span>Start Practicing Now</span>
                    <ChevronRight className="w-4 h-4 stroke-[1.5]" />
                  </Link>
                  <a
                    href="#patterns"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 2xl:px-6 2xl:py-3.5 rounded-md bg-[#17181B] border border-[#25272C] text-gray-300 font-[300] text-sm 2xl:text-base tracking-wide transition-all duration-150 hover:bg-[#1F2024] hover:text-white"
                  >
                    <span>View 41 Patterns</span>
                  </a>
                </div>

                {/* Metric Row: Extra thin numbers */}
                <div className="pt-6 border-t border-[#25272C] grid grid-cols-3 gap-6 2xl:gap-8 font-pretty-mono text-left">
                  <div>
                    <div className="text-2xl sm:text-3xl 2xl:text-4xl font-[200] text-gray-100 tracking-tight">
                      41
                    </div>
                    <div className="text-xs 2xl:text-sm font-[300] text-gray-500 tracking-wide mt-1">
                      Core Patterns
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl 2xl:text-4xl font-[200] text-gray-100 tracking-tight">
                      423
                    </div>
                    <div className="text-xs 2xl:text-sm font-[300] text-gray-500 tracking-wide mt-1">
                      Company Sets
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl 2xl:text-4xl font-[200] text-emerald-400 tracking-tight">
                      0 ms
                    </div>
                    <div className="text-xs 2xl:text-sm font-[300] text-gray-500 tracking-wide mt-1">
                      Local Latency
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Product UI Mockup */}
              <div className="lg:col-span-7">
                <div className="rounded-xl bg-[#17181B] border border-[#25272C] shadow-2xl overflow-hidden transition-all duration-300 hover:border-[#383A40]">
                  {/* Window Frame Bar */}
                  <div className="bg-[#101113] border-b border-[#25272C] px-4 2xl:px-6 py-2.5 2xl:py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#25272C]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#25272C]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#25272C]" />
                      <span className="text-xs 2xl:text-sm font-pretty-mono font-[300] text-gray-400 ml-2 select-none">
                        workspace / sliding-window
                      </span>
                    </div>

                    {/* Interactive counter */}
                    <div className="flex items-center gap-2 px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded bg-[#17181B] border border-[#25272C] text-xs 2xl:text-sm font-pretty-mono font-[300]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 stroke-[1.5]" />
                      <span className="text-gray-300 tabular-nums">
                        {solvedCount} / {totalCount}
                      </span>
                      <span className="text-gray-500">({progressPercent}%)</span>
                    </div>
                  </div>

                  {/* Filter Subhead */}
                  <div className="p-4 2xl:p-5 border-b border-[#25272C] bg-[#17181B]/60 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-xs 2xl:text-sm font-[300]">
                      <button
                        onClick={() => setActiveTab("all")}
                        className={`px-2.5 py-1 2xl:px-3.5 2xl:py-1.5 rounded transition-colors ${
                          activeTab === "all"
                            ? "bg-[#25272C] text-gray-100 font-[400]"
                            : "text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        All ({mockProblems.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("solved")}
                        className={`px-2.5 py-1 2xl:px-3.5 2xl:py-1.5 rounded transition-colors ${
                          activeTab === "solved"
                            ? "bg-[#25272C] text-emerald-400 font-[400]"
                            : "text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        Solved ({solvedCount})
                      </button>
                      <button
                        onClick={() => setActiveTab("unsolved")}
                        className={`px-2.5 py-1 2xl:px-3.5 2xl:py-1.5 rounded transition-colors ${
                          activeTab === "unsolved"
                            ? "bg-[#25272C] text-gray-100 font-[400]"
                            : "text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        Remaining ({totalCount - solvedCount})
                      </button>
                    </div>
                    <span className="text-[11px] 2xl:text-xs font-pretty-mono font-[300] text-gray-500 hidden sm:inline">
                      Click checkbox to toggle
                    </span>
                  </div>

                  {/* Problem Rows List */}
                  <div className="divide-y divide-[#25272C] bg-[#141518]">
                    {filteredProblems.map((prob) => {
                      const diffColors =
                        prob.difficulty === "Easy"
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          : prob.difficulty === "Medium"
                          ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                          : "text-rose-400 bg-rose-500/10 border-rose-500/20";

                      return (
                        <div
                          key={prob.id}
                          className={`p-3.5 sm:p-4 2xl:p-5 flex items-start sm:items-center justify-between gap-3 transition-colors ${
                            prob.solved ? "bg-[#17181B]/40" : "hover:bg-[#1a1b1f]"
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-3 2xl:gap-4 min-w-0">
                            {/* Checkbox */}
                            <button
                              type="button"
                              onClick={() => toggleProblem(prob.id)}
                              className={`w-5 h-5 2xl:w-5.5 2xl:h-5.5 rounded mt-0.5 sm:mt-0 flex items-center justify-center border transition-all ${
                                prob.solved
                                  ? "bg-emerald-500 border-emerald-500 text-[#101113]"
                                  : "border-[#383A40] bg-[#17181B] hover:border-emerald-500/50"
                              }`}
                              aria-label={`Toggle ${prob.title}`}
                            >
                              {prob.solved && <Check className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 stroke-[2]" />}
                            </button>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 2xl:gap-3 flex-wrap">
                                <span className="text-xs 2xl:text-sm font-pretty-mono font-[300] text-gray-500">
                                  #{prob.number}
                                </span>
                                <span
                                  className={`text-sm 2xl:text-base font-medium tracking-normal transition-colors ${
                                    prob.solved
                                      ? "text-gray-400 line-through"
                                      : "text-gray-100"
                                  }`}
                                >
                                  {prob.title}
                                </span>
                                <span
                                  className={`text-[10px] 2xl:text-xs font-pretty-mono font-[300] px-1.5 2xl:px-2 py-0.5 rounded border ${diffColors}`}
                                >
                                  {prob.difficulty}
                                </span>
                              </div>

                              {prob.notes && (
                                <p className="text-xs 2xl:text-sm font-[300] text-gray-500 mt-1 line-clamp-1 italic">
                                  Intuition: {prob.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Company tags & external link */}
                          <div className="flex items-center gap-2 2xl:gap-3 shrink-0">
                            <div className="hidden sm:flex items-center gap-1 font-pretty-mono font-[300]">
                              {prob.companies.slice(0, 2).map((comp) => (
                                <span
                                  key={comp}
                                  className="text-[10px] 2xl:text-xs px-1.5 2xl:px-2 py-0.5 rounded bg-[#1F2024] text-gray-400 border border-[#25272C]"
                                >
                                  {comp}
                                </span>
                              ))}
                              {prob.companies.length > 2 && (
                                <span className="text-[10px] 2xl:text-xs text-gray-500">
                                  +{prob.companies.length - 2}
                                </span>
                              )}
                            </div>
                            <a
                              href={prob.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded text-gray-500 hover:text-emerald-400 transition-colors"
                              title="Open on LeetCode"
                            >
                              <ExternalLink className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 stroke-[1.5]" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom bar */}
                  <div className="px-4 2xl:px-6 py-3 2xl:py-3.5 bg-[#101113] border-t border-[#25272C] flex items-center justify-between text-xs 2xl:text-sm text-gray-400 font-pretty-mono font-[300]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      IndexedDB synchronized
                    </span>
                    <Link
                      href="/"
                      className="text-emerald-400 hover:text-emerald-300 font-pretty font-[400] flex items-center gap-1"
                    >
                      Open Full Workspace <ArrowUpRight className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 stroke-[1.5]" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SCREEN 2: 41 HIGH-ROI PATTERN TAXONOMY */}
          <section
            id="patterns"
            className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 2xl:px-12 py-16 lg:py-24 2xl:py-28 w-full max-w-[1920px] mx-auto border-t border-[#25272C]"
          >
            <div className="mb-12 2xl:mb-16">
              <div className="inline-flex items-center gap-2 text-xs 2xl:text-sm font-pretty-mono font-[300] tracking-widest text-emerald-400/90 uppercase mb-3">
                <span className="w-2 h-[1px] bg-emerald-400" />
                Pattern-Based Mastery
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-[150] text-gray-100 tracking-tight leading-[1.12] mb-4">
                41 algorithmic templates.{" "}
                <span className="font-[300] text-gray-400 block sm:inline">
                  Stop grinding disconnected questions.
                </span>
              </h2>
              <p className="text-gray-400 font-[300] text-base sm:text-lg 2xl:text-xl max-w-2xl 2xl:max-w-3xl leading-relaxed">
                When you recognize the invariant pattern, the implementation writes
                itself. Every single topic is classified by high return-on-investment
                and real-world frequency.
              </p>
            </div>

            {/* Pattern Matrix & Blueprint */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 2xl:gap-8 items-start">
              {/* Left Selector List */}
              <div className="lg:col-span-5 flex flex-col gap-2.5 2xl:gap-3">
                {PATTERN_MATRIX.map((pat, idx) => {
                  const isActive = idx === activePatternIndex;
                  return (
                    <button
                      key={pat.name}
                      type="button"
                      onClick={() => setActivePatternIndex(idx)}
                      className={`text-left p-4 2xl:p-5 rounded-lg border transition-all ${
                        isActive
                          ? "bg-[#17181B] border-emerald-500/50 shadow-sm"
                          : "bg-[#141518] border-[#25272C] hover:border-[#383A40] hover:bg-[#17181B]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm 2xl:text-base text-gray-100 tracking-wide">
                          {pat.name}
                        </span>
                        <span
                          className={`text-[10px] 2xl:text-xs font-pretty-mono font-[300] px-2 py-0.5 rounded border ${
                            pat.roiColor === "emerald"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : pat.roiColor === "blue"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {pat.roi}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs 2xl:text-sm text-gray-500 font-pretty-mono font-[300]">
                        <span>{pat.count} curated problems</span>
                        <span>•</span>
                        <span>{pat.complexity.split(",")[0]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Blueprint Card */}
              <div className="lg:col-span-7">
                <div className="rounded-xl bg-[#17181B] border border-[#25272C] p-6 sm:p-8 2xl:p-10">
                  <div className="flex items-center justify-between pb-6 border-b border-[#25272C] mb-6">
                    <div>
                      <span className="text-xs 2xl:text-sm font-pretty-mono font-[300] text-emerald-400 uppercase tracking-widest">
                        Pattern Blueprint #{activePatternIndex + 1}
                      </span>
                      <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-medium text-gray-100 tracking-tight mt-1">
                        {PATTERN_MATRIX[activePatternIndex].name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs 2xl:text-sm font-pretty-mono font-[300] text-gray-400 block">
                        Target Time & Space
                      </span>
                      <span className="text-xs 2xl:text-sm font-pretty-mono font-[400] text-emerald-400">
                        {PATTERN_MATRIX[activePatternIndex].complexity}
                      </span>
                    </div>
                  </div>

                  {/* Core Idea */}
                  <div className="mb-6">
                    <h4 className="text-xs 2xl:text-sm font-pretty-mono font-[300] uppercase text-gray-400 tracking-wider mb-2">
                      Algorithmic Invariant
                    </h4>
                    <p className="text-gray-300 font-[300] text-sm sm:text-base 2xl:text-lg leading-relaxed bg-[#101113] p-4 2xl:p-5 rounded-lg border border-[#25272C]">
                      {PATTERN_MATRIX[activePatternIndex].coreIdea}
                    </p>
                  </div>

                  {/* Canonical Question */}
                  <div className="mb-8">
                    <h4 className="text-xs 2xl:text-sm font-pretty-mono font-[300] uppercase text-gray-400 tracking-wider mb-2">
                      Canonical Benchmark Problem
                    </h4>
                    <div className="p-4 2xl:p-5 rounded-lg bg-[#141518] border border-[#25272C] flex items-center justify-between">
                      <div className="flex items-center gap-3 2xl:gap-4">
                        <Code2 className="w-5 h-5 2xl:w-6 2xl:h-6 text-emerald-400 stroke-[1.5] shrink-0" />
                        <div>
                          <div className="text-sm 2xl:text-base font-normal text-gray-200">
                            {PATTERN_MATRIX[activePatternIndex].canonical}
                          </div>
                          <div className="text-xs 2xl:text-sm text-gray-500 font-pretty-mono font-[300] mt-0.5">
                            Standard interview baseline question
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/"
                        className="px-3 py-1.5 2xl:px-4 2xl:py-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs 2xl:text-sm font-pretty-mono font-[300] transition-colors shrink-0"
                      >
                        Solve in App
                      </Link>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-6 pt-6 border-t border-[#25272C] text-xs 2xl:text-sm font-pretty-mono font-[300] text-gray-400">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 stroke-[1.5]" />
                      <span>Includes boundary checks and corner cases</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 stroke-[1.5]" />
                      <span>Mapped across 423 company archives</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SCREEN 3: 423 CANONICAL COMPANY DIRECTORIES */}
          <section
            id="companies"
            className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 2xl:px-12 py-16 lg:py-24 2xl:py-28 w-full max-w-[1920px] mx-auto border-t border-[#25272C]"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 2xl:mb-16">
              <div>
                <div className="inline-flex items-center gap-2 text-xs 2xl:text-sm font-pretty-mono font-[300] tracking-widest text-emerald-400/90 uppercase mb-3">
                  <span className="w-2 h-[1px] bg-emerald-400" />
                  Targeted Company Question Pools
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-[150] text-gray-100 tracking-tight leading-[1.12] mb-4">
                  423 company archives.{" "}
                  <span className="font-[300] text-gray-400 block sm:inline">
                    Exact question frequency.
                  </span>
                </h2>
                <p className="text-gray-400 font-[300] text-base sm:text-lg 2xl:text-xl max-w-2xl 2xl:max-w-3xl leading-relaxed">
                  Filter directly by the specific company where your next round is
                  scheduled. See exact question counts and difficulty distributions.
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full md:w-80 2xl:w-96">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.5]" />
                  <input
                    type="text"
                    placeholder="Filter 423 companies..."
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 2xl:py-3 rounded-lg bg-[#17181B] border border-[#25272C] text-sm 2xl:text-base font-[300] text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Company Cards Grid: 4 columns on 2xl screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 2xl:gap-6">
              {filteredCompanyList.map((comp) => {
                const compPercent = Math.round(
                  (comp.solvedMock / comp.totalProblems) * 100
                );
                return (
                  <div
                    key={comp.name}
                    className="rounded-xl bg-[#17181B] border border-[#25272C] p-5 2xl:p-6 flex flex-col justify-between transition-all duration-200 hover:border-[#383A40] hover:-translate-y-0.5 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 2xl:w-9 2xl:h-9 rounded-md bg-[#1F2024] border border-[#25272C] flex items-center justify-center font-pretty-mono font-[300] text-xs 2xl:text-sm text-gray-300 group-hover:border-emerald-500/40">
                            {comp.name.substring(0, 2).toUpperCase()}
                          </div>
                          <h3 className="font-medium text-base 2xl:text-lg text-gray-100 tracking-wide">
                            {comp.name}
                          </h3>
                        </div>
                        <span className="text-[10px] 2xl:text-xs font-pretty-mono font-[300] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {comp.frequency}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs 2xl:text-sm font-pretty-mono font-[300] text-gray-400 mb-2">
                        <span>Question archive:</span>
                        <span className="text-gray-200">{comp.totalProblems} problems</span>
                      </div>

                      <div className="flex items-center justify-between text-xs 2xl:text-sm font-pretty-mono font-[300] text-gray-500 mb-4">
                        <span>Top tested pattern:</span>
                        <span className="text-gray-300">{comp.topTopic}</span>
                      </div>
                    </div>

                    {/* Progress Bar & Launch Link */}
                    <div className="pt-4 border-t border-[#25272C]">
                      <div className="flex items-center justify-between text-xs 2xl:text-sm font-pretty-mono font-[300] text-gray-500 mb-1.5">
                        <span>Practice completion</span>
                        <span>
                          {comp.solvedMock} / {comp.totalProblems}
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-[#25272C] overflow-hidden mb-4">
                        <div
                          className="h-full bg-emerald-500/80 rounded-full"
                          style={{ width: `${compPercent}%` }}
                        />
                      </div>

                      <Link
                        href="/"
                        className="w-full py-2 2xl:py-2.5 rounded bg-[#1F2024] border border-[#25272C] text-xs 2xl:text-sm font-[300] tracking-wide text-gray-300 flex items-center justify-center gap-1.5 transition-colors group-hover:bg-emerald-500 group-hover:text-[#101113] group-hover:border-emerald-500"
                      >
                        <span>Practice {comp.name} Questions</span>
                        <ArrowUpRight className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 stroke-[1.5]" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom info banner */}
            <div className="mt-8 2xl:mt-10 p-4 2xl:p-5 rounded-lg bg-[#141518] border border-[#25272C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs 2xl:text-sm font-pretty-mono font-[300] text-gray-400">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400 stroke-[1.5]" />
                Including Uber, Netflix, Stripe, Databricks, Snowflake, Goldman Sachs, and 415 others.
              </span>
              <Link
                href="/"
                className="text-emerald-400 hover:text-emerald-300 font-pretty font-[400]"
              >
                Explore all 423 companies in workspace &rarr;
              </Link>
            </div>
          </section>

          {/* SCREEN 4: ZERO-TELEMETRY & OFFLINE ARCHITECTURE */}
          <section
            id="offline"
            className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 2xl:px-12 py-16 lg:py-24 2xl:py-28 w-full max-w-[1920px] mx-auto border-t border-[#25272C]"
          >
            <div className="mb-14 2xl:mb-16">
              <div className="inline-flex items-center gap-2 text-xs 2xl:text-sm font-pretty-mono font-[300] tracking-widest text-emerald-400/90 uppercase mb-3">
                <span className="w-2 h-[1px] bg-emerald-400" />
                System Architecture
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-[150] text-gray-100 tracking-tight leading-[1.12] mb-4">
                Engineered for zero latency{" "}
                <span className="font-[300] text-gray-400 block sm:inline">
                  and continuous focus.
                </span>
              </h2>
              <p className="text-gray-400 font-[300] text-base sm:text-lg 2xl:text-xl max-w-2xl 2xl:max-w-3xl leading-relaxed">
                No cloud accounts to manage, no passwords to forget, and zero tracking
                scripts. Everything runs in your browser engine with dual-tier local
                persistence.
              </p>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-8">
              {/* Pillar 1 */}
              <div className="rounded-xl bg-[#17181B] border border-[#25272C] p-6 2xl:p-8 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-lg bg-[#1F2024] border border-[#25272C] flex items-center justify-center text-emerald-400 mb-5">
                    <HardDrive className="w-5 h-5 2xl:w-6 2xl:h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg 2xl:text-xl font-[300] text-gray-100 tracking-wide mb-2">
                    Dual-Tier Local Storage
                  </h3>
                  <p className="text-gray-400 font-[300] text-sm 2xl:text-base leading-relaxed mb-4">
                    IndexedDB backed by Dexie.js for heavy problem state, paired with
                    synchronous localStorage backups. Your progress survives browser
                    restarts and operates completely offline.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#25272C] text-xs 2xl:text-sm font-pretty-mono font-[300] text-emerald-400">
                  100% offline-ready
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="rounded-xl bg-[#17181B] border border-[#25272C] p-6 2xl:p-8 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-lg bg-[#1F2024] border border-[#25272C] flex items-center justify-center text-emerald-400 mb-5">
                    <FileText className="w-5 h-5 2xl:w-6 2xl:h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg 2xl:text-xl font-[300] text-gray-100 tracking-wide mb-2">
                    Integrated Approach Notes
                  </h3>
                  <p className="text-gray-400 font-[300] text-sm 2xl:text-base leading-relaxed mb-4">
                    Write intuition summaries, corner-case notes, and custom time/space
                    complexities directly alongside each problem. No need to context switch
                    to external note apps.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#25272C] text-xs 2xl:text-sm font-pretty-mono font-[300] text-emerald-400">
                  Auto-saved per problem
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="rounded-xl bg-[#17181B] border border-[#25272C] p-6 2xl:p-8 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-lg bg-[#1F2024] border border-[#25272C] flex items-center justify-center text-emerald-400 mb-5">
                    <Zap className="w-5 h-5 2xl:w-6 2xl:h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg 2xl:text-xl font-[300] text-gray-100 tracking-wide mb-2">
                    Instantaneous Searching
                  </h3>
                  <p className="text-gray-400 font-[300] text-sm 2xl:text-base leading-relaxed mb-4">
                    Filter across 17,000+ problem pairings in under 4 milliseconds.
                    Everything is pre-indexed in-memory so there are zero loading spinners
                    or API latency.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#25272C] text-xs 2xl:text-sm font-pretty-mono font-[300] text-emerald-400">
                  Sub-millisecond filtering
                </div>
              </div>
            </div>
          </section>

          {/* SCREEN 5: FINAL LAUNCH CALL TO ACTION & FOOTER */}
          <section className="min-h-[80vh] flex flex-col justify-between px-4 sm:px-6 lg:px-8 2xl:px-12 pt-16 pb-12 w-full max-w-[1920px] mx-auto border-t border-[#25272C]">
            <div className="my-auto py-12 text-center max-w-3xl 2xl:max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 text-xs 2xl:text-sm font-pretty-mono font-[300] tracking-widest text-emerald-400/90 uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5 stroke-[1.5]" />
                Direct Practice Environment
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-[150] text-gray-100 tracking-tight leading-[1.08] mb-5">
                Ready to practice with systematic clarity?
              </h2>
              <p className="text-gray-400 font-[300] text-base sm:text-lg 2xl:text-xl leading-relaxed mb-8 max-w-xl 2xl:max-w-2xl mx-auto">
                No account creation. No credit card. Launch the workspace right in your
                browser and start checking off problems immediately.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 2xl:px-10 py-3.5 2xl:py-4 rounded-md bg-emerald-500/90 text-[#101113] font-[400] text-base 2xl:text-lg tracking-wide transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98] shadow-lg shadow-emerald-950/50"
                >
                  <span>Launch DSASheeeet Workspace</span>
                  <ArrowUpRight className="w-4 h-4 2xl:w-5 2xl:h-5 stroke-[1.5]" />
                </Link>
              </div>
            </div>

            {/* Clean Engineering Footer */}
            <footer className="pt-8 border-t border-[#25272C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs 2xl:text-sm font-pretty-mono font-[300] text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-[300]">{"{ }"}</span>
                <span className="text-gray-300 font-pretty font-[300] tracking-wide">
                  DSASheeeet
                </span>
                <span>•</span>
                <span>41 Patterns</span>
                <span>•</span>
                <span>423 Companies</span>
              </div>

              <div className="flex items-center gap-6 2xl:gap-8">
                <Link href="/" className="hover:text-gray-300 transition-colors">
                  Workspace
                </Link>
                <a
                  href="#patterns"
                  className="hover:text-gray-300 transition-colors"
                >
                  Patterns
                </a>
                <a
                  href="#companies"
                  className="hover:text-gray-300 transition-colors"
                >
                  Companies
                </a>
                <a
                  href="#offline"
                  className="hover:text-gray-300 transition-colors"
                >
                  Architecture
                </a>
              </div>

              <div>
                <span>Built for focused preparation. Local first.</span>
              </div>
            </footer>
          </section>
        </main>
      </div>
  );
}
