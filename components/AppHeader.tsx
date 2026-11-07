"use client";

import React from "react";
import Link from "next/link";
import { Search, CheckCircle2, X } from "lucide-react";
import { TrackerMode } from "@/lib/types";

interface AppHeaderProps {
  mode: TrackerMode;
  onModeChange: (m: TrackerMode) => void;
  completedCount: number;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function AppHeader({
  mode,
  onModeChange,
  completedCount,
  totalCount,
  searchQuery,
  onSearchChange,
}: AppHeaderProps) {
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const searchPlaceholder =
    mode === "company" ? "Search 423 companies..." : "Search problems or patterns...";

  return (
    <header className="sticky top-0 z-30 w-full bg-[#101113]/90 backdrop-blur-md border-b border-[#25272C] px-4 sm:px-6 lg:px-8 2xl:px-12 py-2.5 transition-colors">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        {/* Brand & Progress */}
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <Link
              href="/home"
              className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer transition-opacity hover:opacity-90"
              title="Go to Landing Page"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#17181B] border border-[#292A2E] flex items-center justify-center text-xs sm:text-sm font-semibold text-emerald-400 tracking-wider transition-colors group-hover:border-emerald-500/50">
                {"{ }"}
              </div>
              <h1 className="font-pretty font-[300] text-base sm:text-lg text-gray-100 tracking-wide select-none">
                DSASheeeet
              </h1>
            </Link>

            {/* Version Badge: V1.1.1 matching landing page */}
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-pretty-mono font-[300] text-emerald-400">
              V1.1.1
            </span>
          </div>

          {/* Restrained Progress Indicator */}
          <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md bg-[#17181B] border border-[#25272C]">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 stroke-[1.5]" />
            <span className="text-xs sm:text-sm font-pretty-mono font-[300] text-gray-300 tabular-nums">
              {completedCount} <span className="text-gray-600">/</span>{" "}
              {totalCount}{" "}
              <span className="text-gray-500 text-xs">
                ({percentage}%)
              </span>
            </span>
            <div className="w-16 sm:w-20 h-1.5 bg-[#25272C] rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-emerald-500/80 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Search & Mode Switcher Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Integrated Search Input */}
          <div className="relative flex-1 md:w-64 lg:w-72 2xl:w-80">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8.5 pr-7 py-1.5 text-xs sm:text-sm font-[300] rounded-md bg-[#17181B] border border-[#25272C] focus:border-emerald-500/50 text-gray-200 placeholder-gray-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-500 hover:text-gray-300 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3 h-3 stroke-[1.5]" />
              </button>
            )}
          </div>

          {/* Segmented Mode Switcher */}
          <div className="flex items-center p-0.5 bg-[#17181B] border border-[#25272C] rounded-md shrink-0">
            <button
              type="button"
              onClick={() => mode !== "topic" && onModeChange("topic")}
              className={`px-3 py-1 sm:py-1.5 text-xs font-[300] tracking-wide rounded transition-colors duration-150 cursor-pointer select-none ${
                mode === "topic"
                  ? "bg-[#25272C] text-emerald-400 font-[400] shadow-xs"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Patterns
            </button>
            <button
              type="button"
              onClick={() => mode !== "company" && onModeChange("company")}
              className={`px-3 py-1 sm:py-1.5 text-xs font-[300] tracking-wide rounded transition-colors duration-150 cursor-pointer select-none ${
                mode === "company"
                  ? "bg-[#25272C] text-emerald-400 font-[400] shadow-xs"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Companies
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
