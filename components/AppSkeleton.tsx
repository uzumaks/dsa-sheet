"use client";

import React from "react";

export function AppSkeleton() {
  return (
    <div className="h-screen w-full bg-[#101113] text-gray-100 flex flex-col overflow-hidden select-none animate-pulse font-pretty">
      {/* 1. Header Skeleton */}
      <header className="sticky top-0 z-30 w-full bg-[#101113]/90 backdrop-blur-md border-b border-[#25272C] px-4 sm:px-6 lg:px-8 2xl:px-12 py-2.5">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-4">
          {/* Logo & Brand & Progress */}
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#1F2024] border border-[#292A2E] flex items-center justify-center text-emerald-400/50 font-semibold text-xs sm:text-sm">
                {"{ }"}
              </div>
              <div className="h-5 w-24 sm:w-28 bg-[#1F2024] rounded" />
            </div>

            {/* Progress Box Skeleton */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#17181B] border border-[#292A2E]">
              <div className="w-4 h-4 rounded-full bg-[#25272C]" />
              <div className="h-4 w-16 bg-[#25272C] rounded" />
              <div className="w-16 h-2 bg-[#25272C] rounded-full hidden sm:block" />
            </div>
          </div>

          {/* Search & Mode Switcher Skeleton */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <div className="h-8 w-44 sm:w-64 bg-[#17181B] border border-[#292A2E] rounded-md hidden sm:block" />
            <div className="h-8 w-36 bg-[#17181B] border border-[#292A2E] rounded-md" />
          </div>
        </div>
      </header>

      {/* 2. Main Body Skeleton: Sidebar + Content */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row w-full max-w-[1920px] mx-auto overflow-hidden">
        {/* Desktop Sidebar Skeleton */}
        <div className="hidden lg:flex shrink-0 w-72 xl:w-80 2xl:w-96 h-full flex-col bg-[#101113] border-r border-[#25272C] p-3.5 space-y-2">
          {/* Sidebar Top Search */}
          <div className="h-8 w-full bg-[#17181B] border border-[#25272C] rounded-md mb-2" />
          
          {/* Skeleton Categories / Companies */}
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-full px-3 rounded-md bg-[#17181B]/70 border border-[#25272C]/50 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-3.5 bg-[#25272C] rounded" />
                <div
                  className="h-3.5 bg-[#25272C] rounded"
                  style={{ width: `${60 + (i % 5) * 18}px` }}
                />
              </div>
              <div className="w-9 h-3.5 bg-[#25272C]/70 rounded" />
            </div>
          ))}
        </div>

        {/* Problem List Main View Skeleton */}
        <main className="flex-1 min-h-0 h-full flex flex-col min-w-0 bg-[#141518] overflow-hidden">
          {/* Subheader Toolbar Skeleton */}
          <div className="h-11 shrink-0 px-4 sm:px-6 bg-[#101113] border-b border-[#292A2E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-36 sm:w-48 bg-[#1F2024] rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 bg-[#17181B] border border-[#25272C] rounded" />
              <div className="h-6 w-16 bg-[#17181B] border border-[#25272C] rounded" />
              <div className="h-6 w-16 bg-[#17181B] border border-[#25272C] rounded" />
            </div>
          </div>

          {/* Problem Rows Skeletons */}
          <div className="flex-1 divide-y divide-[#202125] bg-[#141518] overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 min-h-[48px] bg-[#17181B]/50"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Checkbox */}
                  <div className="w-5 h-5 rounded bg-[#25272C] shrink-0" />
                  {/* Number */}
                  <div className="w-6 h-3.5 bg-[#25272C] rounded shrink-0 hidden sm:block" />
                  {/* Title Bar with varying realistic widths */}
                  <div
                    className="h-4 bg-[#25272C] rounded"
                    style={{
                      width: `${160 + ((i * 37) % 220)}px`,
                      maxWidth: "70%",
                    }}
                  />
                </div>

                {/* Right badges & links */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {/* Difficulty Tag */}
                  <div className="w-14 h-5 rounded bg-[#25272C] border border-[#292A2E]" />
                  {/* Notes & Link Icons */}
                  <div className="w-6 h-6 rounded bg-[#25272C]/60" />
                  <div className="w-6 h-6 rounded bg-[#25272C]/60" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

