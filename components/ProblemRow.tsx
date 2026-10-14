'use client';

import React from 'react';
import { Problem, Difficulty } from '@/lib/types';
import { NotesEditor } from './NotesEditor';
import { Check, Plus, Minus, ExternalLink } from 'lucide-react';

interface ProblemRowProps {
  problem: Problem;
  isNotesExpanded: boolean;
  onToggleComplete: (id: string) => void;
  onToggleNotes: (id: string) => void;
  onSaveNotes: (id: string, notes: string) => Promise<void>;
}

const difficultyStyles: Record<Difficulty, { tag: string; label: string }> = {
  easy: {
    tag: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40',
    label: 'Easy',
  },
  medium: {
    tag: 'bg-amber-950/60 text-amber-400 border border-amber-800/40',
    label: 'Medium',
  },
  hard: {
    tag: 'bg-red-950/60 text-red-400 border border-red-800/40',
    label: 'Hard',
  },
};

export function ProblemRow({
  problem,
  isNotesExpanded,
  onToggleComplete,
  onToggleNotes,
  onSaveNotes,
}: ProblemRowProps) {
  const diff = difficultyStyles[problem.difficulty] || difficultyStyles.easy;
  const hasNotes = Boolean(problem.notes && problem.notes.trim().length > 0);

  return (
    <div
      className={`group transition-colors border-b border-[#202125] ${
        problem.completed ? 'bg-[#121316]/60' : 'bg-[#17181B] hover:bg-[#1B1C20]'
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-3.5 sm:px-6 py-3 min-h-[50px]">
        {/* 1. Completion Checkbox & 2. Problem Title */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          {/* Completion Checkbox */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(problem.id);
            }}
            className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded shrink-0 flex items-center justify-center transition-all cursor-pointer ${
              problem.completed
                ? 'bg-emerald-600/90 text-black border border-emerald-500'
                : 'bg-[#111214] border border-[#383A40] hover:border-emerald-500/70 text-transparent'
            }`}
            aria-label={problem.completed ? 'Mark incomplete' : 'Mark completed'}
          >
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
          </button>

          {/* Problem Title (Clicking opens URL in new tab) */}
          <div className="min-w-0 flex-1 flex items-center gap-2">
            <span className="text-gray-500 text-xs sm:text-sm font-mono shrink-0 select-none">
              {problem.order}.
            </span>
            {problem.url ? (
              <a
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[13px] sm:text-[15px] font-normal truncate transition-colors group-hover:text-white leading-normal ${
                  problem.completed
                    ? 'text-gray-400 line-through decoration-gray-500/60 hover:text-gray-200'
                    : 'text-gray-200 hover:text-emerald-400 hover:underline'
                }`}
                title={`Open "${problem.title}" on LeetCode`}
              >
                {problem.title}
              </a>
            ) : (
              <span
                className={`text-[13px] sm:text-[15px] truncate leading-normal ${
                  problem.completed ? 'text-gray-400 line-through' : 'text-gray-200'
                }`}
              >
                {problem.title}
              </span>
            )}

            {problem.url && (
              <a
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-gray-400 transition-opacity p-0.5 shrink-0"
                title="Open LeetCode problem in new tab"
                aria-label="Open LeetCode problem"
              >
                <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* 3. Difficulty Tag & 4. Plus/Notes Button */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Difficulty Badge */}
          <span
            className={`text-[11px] sm:text-xs font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider ${diff.tag}`}
          >
            {diff.label}
          </span>

          {/* Plus / Minus Notes Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleNotes(problem.id);
            }}
            className={`relative p-1.5 rounded-md text-xs sm:text-sm transition-colors flex items-center justify-center cursor-pointer ${
              isNotesExpanded
                ? 'bg-[#292A2E] text-emerald-400'
                : hasNotes
                ? 'text-emerald-400/90 hover:bg-[#25272C]'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#25272C]'
            }`}
            title={isNotesExpanded ? 'Collapse notes' : hasNotes ? 'View notes' : 'Add notes'}
            aria-label="Toggle notes"
          >
            {isNotesExpanded ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {/* Subtle dot if notes exist and not expanded */}
            {hasNotes && !isNotesExpanded && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#17181B]" />
            )}
          </button>
        </div>
      </div>

      {/* Inline Expandable Notes Area */}
      {isNotesExpanded && (
        <NotesEditor
          problemId={problem.id}
          initialNotes={problem.notes}
          onSaveNotes={onSaveNotes}
        />
      )}
    </div>
  );
}
