'use client';

import React from 'react';
import { CheckCircle2, SearchX, FilterX } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-problems' | 'no-search-results' | 'no-difficulty-match' | 'all-completed';
  topicName?: string;
  onAction?: () => void;
}

export function EmptyState({ type, topicName, onAction }: EmptyStateProps) {
  if (type === 'no-search-results') {
    return (
      <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
        <SearchX className="w-8 h-8 text-gray-500 mb-2 stroke-[1.5]" />
        <p className="text-xs text-gray-300 font-medium">No matching problems found</p>
        <p className="text-[11px] text-gray-500 mt-1">
          Try adjusting your search query or clear the filter.
        </p>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 font-medium underline cursor-pointer"
          >
            Clear search
          </button>
        )}
      </div>
    );
  }

  if (type === 'no-difficulty-match') {
    return (
      <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
        <FilterX className="w-8 h-8 text-gray-500 mb-2 stroke-[1.5]" />
        <p className="text-xs text-gray-300 font-medium">No problems with this difficulty</p>
        <p className="text-[11px] text-gray-500 mt-1">
          There are no questions matching this filter in {topicName || 'this topic'}.
        </p>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 font-medium underline cursor-pointer"
          >
            Show all difficulties
          </button>
        )}
      </div>
    );
  }

  if (type === 'all-completed') {
    return (
      <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-500/80 mb-2 stroke-[1.5]" />
        <p className="text-xs text-gray-200 font-medium">
          All problems completed in {topicName || 'this pattern'}!
        </p>
        <p className="text-[11px] text-gray-500 mt-1">
          Excellent work. You can review your approach notes or move on to the next pattern.
        </p>
      </div>
    );
  }

  // Default: no-problems
  return (
    <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
      <p className="text-xs text-gray-400 font-medium">
        No problems found in {topicName || 'this topic'}.
      </p>
    </div>
  );
}
