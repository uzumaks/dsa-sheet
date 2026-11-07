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
      <div className="py-20 px-4 text-center flex flex-col items-center justify-center font-pretty">
        <SearchX className="w-8 h-8 text-gray-500 mb-3 stroke-[1.5]" />
        <p className="text-sm font-[300] text-gray-200">No matching problems found</p>
        <p className="text-xs font-[300] text-gray-500 mt-1">
          Try adjusting your search keywords or clear the active query.
        </p>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-4 px-3 py-1.5 rounded-md bg-[#17181B] border border-[#25272C] text-xs font-[300] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Clear search filter
          </button>
        )}
      </div>
    );
  }

  if (type === 'no-difficulty-match') {
    return (
      <div className="py-20 px-4 text-center flex flex-col items-center justify-center font-pretty">
        <FilterX className="w-8 h-8 text-gray-500 mb-3 stroke-[1.5]" />
        <p className="text-sm font-[300] text-gray-200">No problems with this difficulty</p>
        <p className="text-xs font-[300] text-gray-500 mt-1">
          There are no questions matching this filter in {topicName || 'this section'}.
        </p>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-4 px-3 py-1.5 rounded-md bg-[#17181B] border border-[#25272C] text-xs font-[300] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Show all difficulties
          </button>
        )}
      </div>
    );
  }

  if (type === 'all-completed') {
    return (
      <div className="py-20 px-4 text-center flex flex-col items-center justify-center font-pretty">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 stroke-[1.5]" />
        </div>
        <p className="text-base font-[300] text-gray-100">
          All problems completed in {topicName || 'this category'}!
        </p>
        <p className="text-xs font-[300] text-gray-500 mt-1 max-w-sm">
          Systematic progress verified. Review your approach notes or continue to the next pattern.
        </p>
      </div>
    );
  }

  // Default: no-problems
  return (
    <div className="py-20 px-4 text-center flex flex-col items-center justify-center font-pretty">
      <p className="text-sm font-[300] text-gray-400">No problems available in this selection.</p>
    </div>
  );
}
