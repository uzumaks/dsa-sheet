'use client';

import React from 'react';
import { DifficultyFilter as DiffFilterType, StatusFilter, SortOption } from '@/lib/types';
import { CustomTopicDropdown } from './CustomTopicDropdown';
import { CustomSortDropdown } from './CustomSortDropdown';
import { Rows, LayoutGrid } from 'lucide-react';

interface DifficultyFilterProps {
  difficulty: DiffFilterType;
  onDifficultyChange: (d: DiffFilterType) => void;
  status: StatusFilter;
  onStatusChange: (s: StatusFilter) => void;
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  totalShown: number;
  availableTopics?: string[];
  selectedTopic?: string;
  onTopicChange?: (topic: string) => void;
  viewLayout?: 'stream' | 'grouped';
  onViewLayoutChange?: (v: 'stream' | 'grouped') => void;
}

export function DifficultyFilter({
  difficulty,
  onDifficultyChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  totalShown,
  availableTopics,
  selectedTopic,
  onTopicChange,
  viewLayout = 'stream',
  onViewLayoutChange,
}: DifficultyFilterProps) {
  return (
    <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-2.5 py-2 px-3.5 sm:px-6 bg-[#141518] border-b border-[#25272C] text-xs font-pretty">
      {/* Left side: Difficulty Pills + Custom Topic Dropdown */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Difficulty Buttons */}
        <div className="flex items-center gap-0.5 bg-[#17181B] border border-[#25272C] rounded-md p-0.5 h-7.5">
          <button
            type="button"
            onClick={() => onDifficultyChange('all')}
            className={`px-2.5 h-full rounded font-[300] transition-colors cursor-pointer select-none ${
              difficulty === 'all'
                ? 'bg-[#25272C] text-gray-100 font-[400]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onDifficultyChange('easy')}
            className={`flex items-center gap-1.5 px-2.5 h-full rounded font-[300] transition-colors cursor-pointer select-none ${
              difficulty === 'easy'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-[400]'
                : 'text-gray-400 hover:text-emerald-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Easy</span>
          </button>
          <button
            type="button"
            onClick={() => onDifficultyChange('medium')}
            className={`flex items-center gap-1.5 px-2.5 h-full rounded font-[300] transition-colors cursor-pointer select-none ${
              difficulty === 'medium'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-[400]'
                : 'text-gray-400 hover:text-amber-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Medium</span>
          </button>
          <button
            type="button"
            onClick={() => onDifficultyChange('hard')}
            className={`flex items-center gap-1.5 px-2.5 h-full rounded font-[300] transition-colors cursor-pointer select-none ${
              difficulty === 'hard'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 font-[400]'
                : 'text-gray-400 hover:text-rose-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Hard</span>
          </button>
        </div>

        {/* Custom Styled Topic Dropdown in Company Wise mode */}
        {availableTopics && availableTopics.length > 0 && onTopicChange && (
          <CustomTopicDropdown
            availableTopics={availableTopics}
            selectedTopic={selectedTopic}
            onSelectTopic={onTopicChange}
          />
        )}
      </div>

      {/* Right side: Status Filter + View Toggle + Custom Sort Dropdown + Count */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Status Filter */}
        <div className="flex items-center gap-0.5 bg-[#17181B] border border-[#25272C] rounded-md p-0.5 h-7.5">
          <button
            type="button"
            onClick={() => onStatusChange('all')}
            className={`px-2.5 h-full rounded font-[300] transition-colors cursor-pointer select-none ${
              status === 'all'
                ? 'bg-[#25272C] text-gray-200 font-[400]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('incomplete')}
            className={`px-2.5 h-full rounded font-[300] transition-colors cursor-pointer select-none ${
              status === 'incomplete'
                ? 'bg-[#25272C] text-gray-200 font-[400]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Todo
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('completed')}
            className={`px-2.5 h-full rounded font-[300] transition-colors cursor-pointer select-none ${
              status === 'completed'
                ? 'bg-[#25272C] text-emerald-400 font-[400]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Done
          </button>
        </div>

        {/* Stream vs Grouped View Layout Toggle */}
        {onViewLayoutChange && (
          <div className="hidden sm:flex items-center gap-0.5 bg-[#17181B] border border-[#25272C] rounded-md p-0.5 h-7.5">
            <button
              type="button"
              onClick={() => onViewLayoutChange('stream')}
              className={`p-1.5 h-full rounded transition-colors cursor-pointer ${
                viewLayout === 'stream'
                  ? 'bg-[#25272C] text-emerald-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              title="Continuous linear stream"
            >
              <Rows className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
            <button
              type="button"
              onClick={() => onViewLayoutChange('grouped')}
              className={`p-1.5 h-full rounded transition-colors cursor-pointer ${
                viewLayout === 'grouped'
                  ? 'bg-[#25272C] text-emerald-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              title="Grouped by difficulty"
            >
              <LayoutGrid className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>
        )}

        {/* Custom Sort Dropdown */}
        <CustomSortDropdown sort={sort} onSortChange={onSortChange} />

        {/* Total Shown Count */}
        <span className="text-xs text-gray-500 tabular-nums font-pretty-mono font-[300] pl-1">
          ({totalShown})
        </span>
      </div>
    </div>
  );
}
