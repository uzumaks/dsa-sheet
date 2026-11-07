'use client';

import React, { useMemo } from 'react';
import { DisplayProblem, Topic, DifficultyFilter as DiffFilterType, StatusFilter } from '@/lib/types';
import { ProblemRow } from './ProblemRow';
import { EmptyState } from './EmptyState';

interface ProblemListProps {
  problems: DisplayProblem[];
  activeTopic?: Topic;
  activeTitle?: string;
  expandedNotesId: string | null;
  searchQuery: string;
  difficultyFilter: DiffFilterType;
  statusFilter: StatusFilter;
  viewLayout?: 'stream' | 'grouped';
  onToggleComplete: (id: string) => void;
  onToggleNotes: (id: string) => void;
  onSaveNotes: (id: string, notes: string) => Promise<void>;
  onClearSearch: () => void;
  onResetDifficulty: () => void;
}

export function ProblemList({
  problems,
  activeTopic,
  activeTitle,
  expandedNotesId,
  searchQuery,
  difficultyFilter,
  statusFilter,
  viewLayout = 'stream',
  onToggleComplete,
  onToggleNotes,
  onSaveNotes,
  onClearSearch,
  onResetDifficulty,
}: ProblemListProps) {
  const currentTitle = activeTitle || activeTopic?.name || 'Problems';

  // Group problems by difficulty if viewLayout is 'grouped' and filter is 'all'
  const groupedData = useMemo(() => {
    if (viewLayout !== 'grouped' || difficultyFilter !== 'all') return null;

    const easy = problems.filter((p) => p.difficulty === 'easy');
    const medium = problems.filter((p) => p.difficulty === 'medium');
    const hard = problems.filter((p) => p.difficulty === 'hard');

    return [
      {
        id: 'easy',
        title: 'Foundational Warmups',
        difficulty: 'Easy',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        items: easy,
        completedCount: easy.filter((p) => p.completed).length,
      },
      {
        id: 'medium',
        title: 'Core Interview Benchmarks',
        difficulty: 'Medium',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        items: medium,
        completedCount: medium.filter((p) => p.completed).length,
      },
      {
        id: 'hard',
        title: 'Advanced Frontier',
        difficulty: 'Hard',
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        items: hard,
        completedCount: hard.filter((p) => p.completed).length,
      },
    ].filter((group) => group.items.length > 0);
  }, [problems, viewLayout, difficultyFilter]);

  // If no problems to display, determine appropriate empty state
  if (problems.length === 0) {
    if (searchQuery.trim()) {
      return (
        <EmptyState
          type="no-search-results"
          onAction={onClearSearch}
        />
      );
    }

    if (difficultyFilter !== 'all') {
      return (
        <EmptyState
          type="no-difficulty-match"
          topicName={currentTitle}
          onAction={onResetDifficulty}
        />
      );
    }

    if (statusFilter === 'incomplete') {
      return (
        <EmptyState
          type="all-completed"
          topicName={currentTitle}
        />
      );
    }

    return (
      <EmptyState
        type="no-problems"
        topicName={currentTitle}
      />
    );
  }

  // Render Grouped by Difficulty
  if (groupedData && groupedData.length > 0) {
    let continuousIndex = 1;
    return (
      <div className="flex-1 divide-y divide-[#202125] bg-[#141518] font-pretty">
        {groupedData.map((group) => {
          const groupStartIndex = continuousIndex;
          continuousIndex += group.items.length;

          return (
            <div key={group.id} className="flex flex-col">
              {/* Group Section Divider */}
              <div className="px-4 sm:px-6 py-2.5 bg-[#101113]/80 border-y border-[#202125] flex items-center justify-between sticky top-0 z-10 backdrop-blur-xs">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-pretty-mono font-[300] px-2 py-0.5 rounded border ${group.color}`}>
                    {group.difficulty}
                  </span>
                  <span className="text-xs font-[400] text-gray-200">
                    {group.title}
                  </span>
                </div>
                <span className="text-xs font-pretty-mono font-[300] text-gray-400">
                  {group.completedCount} / {group.items.length} completed
                </span>
              </div>

              {/* Problem Rows in this group */}
              <div className="divide-y divide-[#202125]">
                {group.items.map((problem, idx) => (
                  <ProblemRow
                    key={problem.id}
                    problem={problem}
                    displayIndex={groupStartIndex + idx}
                    isNotesExpanded={expandedNotesId === problem.id}
                    onToggleComplete={onToggleComplete}
                    onToggleNotes={onToggleNotes}
                    onSaveNotes={onSaveNotes}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Continuous Stream View (Default)
  return (
    <div className="flex-1 divide-y divide-[#202125] bg-[#141518]">
      {problems.map((problem, index) => (
        <ProblemRow
          key={problem.id}
          problem={problem}
          displayIndex={index + 1}
          isNotesExpanded={expandedNotesId === problem.id}
          onToggleComplete={onToggleComplete}
          onToggleNotes={onToggleNotes}
          onSaveNotes={onSaveNotes}
        />
      ))}
    </div>
  );
}
