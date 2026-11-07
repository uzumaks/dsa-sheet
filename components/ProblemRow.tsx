'use client';

import React from 'react';
import { DisplayProblem, Difficulty } from '@/lib/types';
import { NotesEditor } from './NotesEditor';
import { Check, Plus, Minus, ExternalLink, Tag } from 'lucide-react';

interface ProblemRowProps {
  problem: DisplayProblem;
  displayIndex?: number;
  isNotesExpanded: boolean;
  onToggleComplete: (id: string) => void;
  onToggleNotes: (id: string) => void;
  onSaveNotes: (id: string, notes: string) => Promise<void>;
}

const difficultyStyles: Record<Difficulty, { tag: string; label: string }> = {
  easy: {
    tag: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    label: 'Easy',
  },
  medium: {
    tag: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    label: 'Medium',
  },
  hard: {
    tag: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    label: 'Hard',
  },
};

export const ProblemRow = React.memo(function ProblemRow({
  problem,
  displayIndex,
  isNotesExpanded,
  onToggleComplete,
  onToggleNotes,
  onSaveNotes,
}: ProblemRowProps) {
  const diff = difficultyStyles[problem.difficulty] || difficultyStyles.easy;
  const hasNotes = Boolean(problem.notes && problem.notes.trim().length > 0);
  const visualNumber = displayIndex !== undefined ? displayIndex : problem.order;

  return (
    <div
      className={`group transition-colors border-b border-[#202125] font-pretty ${
        problem.completed ? 'bg-[#121316]/60' : 'bg-[#141518] hover:bg-[#18191E]'
      }`}
    >
      <div className="flex items-start sm:items-center justify-between gap-3 px-3.5 sm:px-6 py-2.5 sm:py-3 min-h-[48px]">
        {/* Checkbox & Serial Number & Title */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
          {/* Completion Checkbox */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(problem.id);
            }}
            className={`w-5 h-5 rounded-[5px] shrink-0 mt-0.5 sm:mt-0 flex items-center justify-center transition-all cursor-pointer ${
              problem.completed
                ? 'bg-emerald-500 text-[#101113] border border-emerald-500 shadow-xs'
                : 'bg-[#17181B] border border-[#2D3036] hover:border-emerald-500/60 text-transparent'
            }`}
            aria-label={problem.completed ? 'Mark incomplete' : 'Mark completed'}
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {/* Serial Number & Title */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <span className="text-gray-500 text-xs sm:text-sm font-pretty-mono font-[300] shrink-0 select-none">
                {visualNumber}.
              </span>

              {problem.url ? (
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[13.5px] sm:text-[14.5px] font-medium tracking-normal truncate transition-colors leading-normal ${
                    problem.completed
                      ? 'text-gray-500 line-through decoration-gray-600 hover:text-gray-300'
                      : 'text-gray-100 hover:text-emerald-400'
                  }`}
                  title={`Open "${problem.title}" on LeetCode`}
                >
                  {problem.title}
                </a>
              ) : (
                <span
                  className={`text-[13.5px] sm:text-[14.5px] font-medium tracking-normal truncate leading-normal ${
                    problem.completed ? 'text-gray-500 line-through' : 'text-gray-100'
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
                  <ExternalLink className="w-3.5 h-3.5 stroke-[1.5]" />
                </a>
              )}

              {/* In Company mode: Show which topic this question tests */}
              {problem.topics && problem.topics.length > 0 && (
                <div className="hidden md:flex items-center gap-1 shrink-0 ml-1">
                  {problem.topics.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-pretty-mono font-[300] px-1.5 py-0.5 rounded bg-[#1A1B20] text-gray-400 border border-[#25272C]"
                    >
                      {t}
                    </span>
                  ))}
                  {problem.topics.length > 2 && (
                    <span className="text-[10px] font-pretty-mono text-gray-600">
                      +{problem.topics.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Intuition note preview if present and editor is collapsed */}
            {hasNotes && !isNotesExpanded && (
              <p className="text-xs font-[300] text-gray-500 mt-0.5 line-clamp-1 italic">
                Intuition: {problem.notes}
              </p>
            )}
          </div>
        </div>

        {/* Difficulty Tag & Notes Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Difficulty Badge */}
          <span
            className={`text-[10px] sm:text-[11px] font-pretty-mono font-[300] px-2 sm:px-2.5 py-0.5 rounded border ${diff.tag}`}
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
                ? 'bg-[#25272C] text-emerald-400'
                : hasNotes
                ? 'text-emerald-400/90 hover:bg-[#1F2024]'
                : 'text-gray-500 hover:text-gray-200 hover:bg-[#1F2024]'
            }`}
            title={isNotesExpanded ? 'Collapse notes' : hasNotes ? 'View notes' : 'Add notes'}
            aria-label="Toggle notes"
          >
            {isNotesExpanded ? (
              <Minus className="w-4 h-4 stroke-[1.5]" />
            ) : (
              <Plus className="w-4 h-4 stroke-[1.5]" />
            )}
            {/* Subtle dot if notes exist and not expanded */}
            {hasNotes && !isNotesExpanded && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-[#17181B]" />
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
});
