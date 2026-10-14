'use client';

import React from 'react';
import { Topic } from '@/lib/types';

interface TopicSidebarProps {
  topics: Topic[];
  selectedTopicId: string;
  topicStats: Map<string, { completed: number; total: number }>;
  onSelectTopic: (id: string) => void;
}

export function TopicSidebar({
  topics,
  selectedTopicId,
  topicStats,
  onSelectTopic,
}: TopicSidebarProps) {
  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col bg-[#101113] border-b lg:border-b-0 lg:border-r border-[#292A2E] h-auto lg:h-full overflow-hidden select-none">
      {/* Sidebar Header */}
      <div className="shrink-0 px-4 py-3.5 border-b border-[#292A2E] flex items-center justify-between bg-[#101113]">
        <span className="text-xs sm:text-[13px] font-semibold tracking-wider text-gray-400 uppercase">
          Patterns &amp; Topics
        </span>
        <span className="text-xs text-gray-500 font-mono">
          {topics.length} total
        </span>
      </div>

      {/* Topics List: Independent Scroll Container */}
      <div className="flex-1 min-h-0 overflow-x-auto lg:overflow-y-auto p-2 sm:p-2.5 flex flex-row lg:flex-col gap-1 sm:gap-1.5 custom-scrollbar overscroll-contain">
        {topics.map((topic) => {
          const isSelected = selectedTopicId === topic.id;
          const stats = topicStats.get(topic.id) || { completed: 0, total: 0 };
          const isAllCompleted = stats.total > 0 && stats.completed === stats.total;

          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onSelectTopic(topic.id)}
              className={`w-full text-left flex items-center justify-between px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-md cursor-pointer transition-all whitespace-nowrap lg:whitespace-normal ${
                isSelected
                  ? 'bg-[#17181B] text-gray-100 font-medium border border-[#292A2E]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#17181B]/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden mr-2">
                <span className="text-xs sm:text-sm truncate">
                  <span className="text-gray-500 text-xs font-mono mr-1.5">
                    {topic.order}.
                  </span>
                  {topic.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`text-xs sm:text-sm tabular-nums font-mono ${
                    isAllCompleted
                      ? 'text-emerald-400 font-medium'
                      : isSelected
                      ? 'text-gray-300'
                      : 'text-gray-500'
                  }`}
                >
                  {stats.completed}/{stats.total}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
