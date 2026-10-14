'use client';

import React from 'react';
import { Search, CheckCircle2, X } from 'lucide-react';

interface AppHeaderProps {
  completedCount: number;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function AppHeader({
  completedCount,
  totalCount,
  searchQuery,
  onSearchChange,
}: AppHeaderProps) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 w-full bg-[#101113]/90 backdrop-blur-md border-b border-[#292A2E] px-4 sm:px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Brand & Progress */}
        <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#17181B] border border-[#292A2E] flex items-center justify-center text-xs sm:text-sm font-semibold text-emerald-400 tracking-wider">
              {'{ }'}
            </div>
            <h1 className="text-base sm:text-lg font-semibold text-gray-100 tracking-tight select-none">
              DSA Tracker
            </h1>
          </div>

          {/* Restrained Progress Indicator */}
          <div className="flex items-center gap-2.5 sm:gap-3 px-3 py-1.5 rounded-md bg-[#17181B] border border-[#292A2E]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400/90" />
            <span className="text-xs sm:text-sm font-medium text-gray-300 tabular-nums">
              {completedCount} <span className="text-gray-500">/</span> {totalCount}{' '}
              <span className="text-gray-400 text-xs font-normal">({percentage}%)</span>
            </span>
            <div className="w-16 sm:w-20 h-1.5 sm:h-2 bg-[#25272C] rounded-full overflow-hidden hidden md:block">
              <div
                className="h-full bg-emerald-500/80 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Compact Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search problems across patterns..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#17181B] border border-[#292A2E] text-xs sm:text-sm text-gray-200 placeholder-gray-500 rounded-md pl-9 pr-8 py-2 focus:outline-none focus:border-[#3E4148] focus:ring-1 focus:ring-[#3E4148] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
