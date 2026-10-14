'use client';

import React from 'react';
import { DifficultyFilter as DiffFilterType, StatusFilter, SortOption } from '@/lib/types';
import { ArrowUpDown, Filter } from 'lucide-react';

interface DifficultyFilterProps {
  difficulty: DiffFilterType;
  onDifficultyChange: (d: DiffFilterType) => void;
  status: StatusFilter;
  onStatusChange: (s: StatusFilter) => void;
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  totalShown: number;
}

export function DifficultyFilter({
  difficulty,
  onDifficultyChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  totalShown,
}: DifficultyFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 py-2.5 px-3 sm:px-4 bg-[#141518] border-b border-[#292A2E] text-xs">
      {/* Difficulty Tabs */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onDifficultyChange('all')}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
            difficulty === 'all'
              ? 'bg-[#222429] text-gray-100 border border-[#383A40]'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1B1F] border border-transparent'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => onDifficultyChange('easy')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
            difficulty === 'easy'
              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
              : 'text-gray-400 hover:text-emerald-400 hover:bg-[#1A1B1F] border border-transparent'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Easy</span>
        </button>
        <button
          type="button"
          onClick={() => onDifficultyChange('medium')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
            difficulty === 'medium'
              ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
              : 'text-gray-400 hover:text-amber-400 hover:bg-[#1A1B1F] border border-transparent'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Medium</span>
        </button>
        <button
          type="button"
          onClick={() => onDifficultyChange('hard')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
            difficulty === 'hard'
              ? 'bg-red-950/60 text-red-400 border border-red-800/60'
              : 'text-gray-400 hover:text-red-400 hover:bg-[#1A1B1F] border border-transparent'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span>Hard</span>
        </button>
      </div>

      {/* Status Filter & Sort Dropdown */}
      <div className="flex items-center gap-2">
        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-[#17181B] border border-[#292A2E] rounded-md p-0.5">
          <button
            type="button"
            onClick={() => onStatusChange('all')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              status === 'all'
                ? 'bg-[#25272D] text-gray-200'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('incomplete')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              status === 'incomplete'
                ? 'bg-[#25272D] text-gray-200'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Todo
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('completed')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              status === 'completed'
                ? 'bg-[#25272D] text-emerald-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Done
          </button>
        </div>

        {/* Sorting Dropdown */}
        <div className="relative flex items-center">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute left-2 pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-[#17181B] border border-[#292A2E] hover:border-[#383A40] text-gray-300 text-[11px] rounded-md pl-7 pr-3 py-1 appearance-none cursor-pointer focus:outline-none focus:border-[#4B505A]"
          >
            <option value="default">Sort: Default</option>
            <option value="name-asc">Name: A → Z</option>
            <option value="name-desc">Name: Z → A</option>
            <option value="difficulty-asc">Difficulty: Easy → Hard</option>
            <option value="difficulty-desc">Difficulty: Hard → Easy</option>
            <option value="incomplete-first">Incomplete first</option>
            <option value="completed-first">Completed first</option>
          </select>
        </div>

        {/* Total Shown Count */}
        <span className="text-[11px] text-gray-400 tabular-nums hidden sm:inline-block">
          ({totalShown})
        </span>
      </div>
    </div>
  );
}
