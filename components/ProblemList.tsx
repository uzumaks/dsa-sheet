'use client';

import React from 'react';
import { Problem, Topic, DifficultyFilter as DiffFilterType, StatusFilter } from '@/lib/types';
import { ProblemRow } from './ProblemRow';
import { EmptyState } from './EmptyState';

interface ProblemListProps {
  problems: Problem[];
  activeTopic?: Topic;
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
          topicName={activeTopic?.name}
          onAction={onResetDifficulty}
        />
      );
    }

    if (statusFilter === 'incomplete') {
      return (
        <EmptyState
          type="all-completed"
          topicName={activeTopic?.name}
        />
      );
    }

    return (
      <EmptyState
        type="no-problems"
        topicName={activeTopic?.name}
      />
    );
  }

  return (
    <div className="flex-1 divide-y divide-[#202125] bg-[#141518]">
      {problems.map((problem) => (
        <ProblemRow
          key={problem.id}
          problem={problem}
          isNotesExpanded={expandedNotesId === problem.id}
          onToggleComplete={onToggleComplete}
          onToggleNotes={onToggleNotes}
          onSaveNotes={onSaveNotes}
        />
      ))}
    </div>
  );
}
