"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Company, DisplayProblem } from "@/lib/types";
import {
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Layers,
  X,
} from "lucide-react";

interface CompanyDossierHeaderProps {
  company: Company;
  problems: DisplayProblem[];
  completedCount: number;
  totalCount: number;
  availableTopics: string[];
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
}

export function CompanyDossierHeader({
  company,
  problems,
  completedCount,
  totalCount,
  availableTopics,
  selectedTopic,
  onTopicChange,
}: CompanyDossierHeaderProps) {
  // Collapsed state with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sheet_dsa_company_dossier_collapsed");
      if (stored !== null) {
        setIsCollapsed(stored === "true");
      }
    } catch {
      // Ignore localStorage read errors in restricted contexts
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sheet_dsa_company_dossier_collapsed", String(next));
      } catch {
        // Ignore localStorage write errors
      }
      return next;
    });
  };

  // Compute difficulty distribution for this company
  const diffCounts = useMemo(() => {
    let easy = 0;
    let medium = 0;
    let hard = 0;
    for (let i = 0; i < problems.length; i++) {
      const d = problems[i].difficulty;
      if (d === "easy") easy++;
      else if (d === "medium") medium++;
      else if (d === "hard") hard++;
    }
    return { easy, medium, hard };
  }, [problems]);

  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Company monogram (e.g., "Google" -> "GO", "Amazon" -> "AM")
  const monogram = company.name.substring(0, 2).toUpperCase();

  return (
    <div
      className={`shrink-0 bg-[#121316] border-b border-[#25272C] transition-all duration-200 font-pretty ${
        isCollapsed ? "py-2.5 px-3.5 sm:px-6" : "p-4 sm:p-5"
      }`}
    >
      {/* Top Banner: Monogram, Company Title & Interview Progress + Dropdown Key ^ */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ${
          isCollapsed ? "mb-0" : "mb-3.5"
        }`}
      >
        {/* Left: Identity */}
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div
            className={`rounded-lg bg-[#17181B] border border-[#292A2E] flex items-center justify-center font-pretty-mono font-[300] text-emerald-400 shrink-0 shadow-sm transition-all ${
              isCollapsed
                ? "w-8 h-8 text-xs sm:w-9 sm:h-9 sm:text-sm"
                : "w-10 h-10 sm:w-11 sm:h-11 text-sm sm:text-base"
            }`}
          >
            {monogram}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg lg:text-xl font-medium text-gray-100 tracking-wide truncate">
                {company.name}
              </h2>
              <span className="text-[10px] font-pretty-mono font-[300] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                Verified Question Pool
              </span>
              {/* Active topic indicator pill when collapsed */}
              {isCollapsed && selectedTopic !== "all" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-pretty px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                  <span>Topic: {selectedTopic}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTopicChange("all");
                    }}
                    className="hover:text-white p-0.5"
                    title="Clear topic filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            {/* Subtitle hidden when collapsed to save space */}
            {!isCollapsed && (
              <div className="flex items-center gap-2 text-xs font-pretty-mono font-[300] text-gray-500 mt-0.5">
                <span>{totalCount} total questions in archive</span>
                <span>•</span>
                <span className="text-gray-400">
                  {availableTopics.length} tested patterns
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Difficulty Split, Progress & Upper Dropdown Toggle Key ^ */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-center">
          {/* Difficulty Chips */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-xs font-pretty-mono font-[300]">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {diffCounts.easy} Easy
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {diffCounts.medium} Med
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {diffCounts.hard} Hard
            </span>
          </div>

          {/* Progress Box */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md bg-[#17181B] border border-[#25272C] text-xs font-pretty-mono font-[300]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 stroke-[1.5]" />
            <span className="text-gray-300 tabular-nums">
              {completedCount}/{totalCount}
            </span>
            <span className="text-gray-500">({percentage}%)</span>
          </div>

          {/* Upper Dropdown Toggle Key ^ (Shrinks or Drops the Topic div) */}
          <button
            type="button"
            onClick={toggleCollapse}
            className="h-7 sm:h-7.5 px-2 sm:px-2.5 rounded-md bg-[#17181B] hover:bg-[#202126] border border-[#25272C] hover:border-[#383A40] text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs font-pretty-mono cursor-pointer select-none shrink-0"
            title={isCollapsed ? "Drop / Expand topic tab (^)" : "Close / Shrink topic tab (^)"}
            aria-label={isCollapsed ? "Expand topic tab" : "Collapse topic tab"}
          >
            <span className="hidden md:inline text-[11px] text-gray-400 font-[300]">
              {isCollapsed ? "Topics" : "Hide"}
            </span>
            {isCollapsed ? (
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 stroke-[2]" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-emerald-400 stroke-[2]" />
            )}
          </button>
        </div>
      </div>

      {/* Horizontal Interactive Pattern Filter Carousel (Closed when isCollapsed is true) */}
      {!isCollapsed && availableTopics.length > 0 && (
        <div className="pt-3 border-t border-[#1F2024] flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-pretty-mono font-[300] text-gray-500 shrink-0 mr-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400/80 stroke-[1.5]" />
            <span className="hidden md:inline">Topic:</span>
          </div>

          {/* Scrollable chip container */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs font-pretty">
            <button
              type="button"
              onClick={() => onTopicChange("all")}
              className={`px-2.5 py-1 rounded-md shrink-0 transition-all cursor-pointer select-none ${
                selectedTopic === "all"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium"
                  : "bg-[#17181B] text-gray-300 hover:text-white border border-[#25272C] font-normal"
              }`}
            >
              All Patterns ({problems.length})
            </button>

            {availableTopics.map((topic) => {
              const isActive = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => onTopicChange(topic)}
                  className={`px-2.5 py-1 rounded-md shrink-0 transition-all cursor-pointer select-none ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium"
                      : "bg-[#17181B] text-gray-300 hover:text-white border border-[#25272C] font-normal"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
