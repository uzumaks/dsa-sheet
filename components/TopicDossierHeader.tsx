'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Topic, DisplayProblem } from '@/lib/types';
import { Code2, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';

interface TopicDossierHeaderProps {
  topic?: Topic;
  problems: DisplayProblem[];
  completedCount: number;
  totalCount: number;
}

// Invariant tips for key algorithmic patterns
const PATTERN_INVARIANTS: Record<string, string> = {
  'topic-1-hash-map-hash-set': 'Constant time O(1) frequency lookups, complements, and visited states.',
  'topic-2-sliding-window': 'Contiguous subsegments; expand right boundary to include, shrink left to preserve validity.',
  'topic-3-two-pointers': 'Opposite or same-direction linear scans eliminating nested quadratic loops.',
  'topic-4-binary-search': 'Monotonic predicate search space; halve candidates each step via mid comparison.',
  'topic-5-prefix-sum': 'Range sum queries in O(1) time paired with hash maps for subarray target matching.',
  'topic-8-stack': 'Last-in-first-out parsing, matching brackets, and depth-first reversals.',
  'topic-9-monotonic-stack-queue-specific-variants-': 'Order-preserved stack to find nearest greater/smaller element in O(n) amortized time.',
  'topic-11-tree-dfs-preorder-inorder-postorder-': 'Recursive state passing down tree branches with subtree result aggregation.',
  'topic-12-tree-bfs-level-order-': 'Queue-driven level-by-level breadth exploration with depth tracking.',
  'topic-13-dynamic-programming-1d': 'Overlapping subproblems; optimal current choice depends on previous memoized states.',
  'topic-16-graph-dfs': 'Exhaustive path exploration with visited set to prevent cyclic loops.',
  'topic-17-graph-bfs': 'Shortest path in unweighted graphs using level-order distance propagation.',
  'topic-20-intervals-merge-insert-overlap-': 'Sort by start time, merge contiguous overlaps by extending end boundary.',
  'topic-22-dynamic-programming-2d-grid': 'Grid state transitions dp[i][j] based on top and left cell optimal values.',
};

export function TopicDossierHeader({
  topic,
  problems,
  completedCount,
  totalCount,
}: TopicDossierHeaderProps) {
  // Collapsed state with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sheet_dsa_topic_dossier_collapsed');
      if (stored !== null) {
        setIsCollapsed(stored === 'true');
      }
    } catch {
      // Ignore storage read errors in sandboxed contexts
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sheet_dsa_topic_dossier_collapsed', String(next));
      } catch {
        // Ignore storage write errors
      }
      return next;
    });
  };

  const diffCounts = useMemo(() => {
    let easy = 0;
    let medium = 0;
    let hard = 0;
    for (let i = 0; i < problems.length; i++) {
      const d = problems[i].difficulty;
      if (d === 'easy') easy++;
      else if (d === 'medium') medium++;
      else if (d === 'hard') hard++;
    }
    return { easy, medium, hard };
  }, [problems]);

  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const invariant = (topic && PATTERN_INVARIANTS[topic.id]) || 'Algorithmic pattern with recurring interview variants.';

  return (
    <div
      className={`shrink-0 bg-[#121316] border-b border-[#25272C] transition-all duration-200 font-pretty ${
        isCollapsed ? 'py-2.5 px-3.5 sm:px-6' : 'p-3.5 sm:p-4.5'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Pattern Title & Invariant Note */}
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div
            className={`rounded-lg bg-[#16171A] border border-[#24262C] flex items-center justify-center text-emerald-400/90 shrink-0 shadow-xs transition-all ${
              isCollapsed ? 'w-8 h-8' : 'w-9 h-9 sm:w-10 sm:h-10'
            }`}
          >
            <Code2 className={`${isCollapsed ? 'w-4 h-4' : 'w-4.5 h-4.5 sm:w-5 sm:h-5'} stroke-[1.5]`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg lg:text-xl font-normal text-gray-100 tracking-tight truncate">
                {topic ? topic.name : 'All Algorithm Patterns'}
              </h2>
              <span className="text-[10px] font-pretty-mono font-[400] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 select-none">
                {topic ? `Pattern ${topic.order} of 41` : '41 Patterns'}
              </span>
            </div>

            {!isCollapsed && (
              <p className="text-xs text-gray-400 font-[300] mt-1 max-w-2xl line-clamp-1 sm:line-clamp-none leading-relaxed">
                <span className="text-gray-500 font-pretty-mono text-[11px] mr-1.5 uppercase tracking-wide">
                  Invariant:
                </span>
                <span className="text-gray-300 font-[350]">{invariant}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right: Difficulty Counts, Progress Box & Upper Dropdown Key ^ */}
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
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md bg-[#16171A] border border-[#24262C] text-xs font-pretty-mono font-[300]">
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
            className="h-7 sm:h-7.5 px-2 sm:px-2.5 rounded-md bg-[#16171A] hover:bg-[#1E2025] border border-[#24262C] hover:border-[#33353C] text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs font-pretty-mono cursor-pointer select-none shrink-0"
            title={isCollapsed ? "Expand topic header (^)" : "Collapse topic header (^)"}
            aria-label={isCollapsed ? "Expand topic header" : "Collapse topic header"}
          >
            <span className="hidden md:inline text-[11px] text-gray-400 font-[300]">
              {isCollapsed ? "Expand" : "Collapse"}
            </span>
            {isCollapsed ? (
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 stroke-[2]" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-emerald-400 stroke-[2]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

