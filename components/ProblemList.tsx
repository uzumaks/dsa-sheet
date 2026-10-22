'use client';

import React from 'react';
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
  onToggleComplete,
  onToggleNotes,
  onSaveNotes,
  onClearSearch,
  onResetDifficulty,
}: ProblemListProps) {
  const currentTitle = activeTitle || activeTopic?.name || 'Problems';

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
