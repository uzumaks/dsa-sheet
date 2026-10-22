'use client';

import React, { useMemo } from 'react';
import { Topic, Company, TrackerMode } from '@/lib/types';

interface TopicSidebarProps {
  mode: TrackerMode;
  topics: Topic[];
  selectedTopicId: string;
  topicStats: Map<string, { completed: number; total: number }>;
  onSelectTopic: (id: string) => void;
  companies: Company[];
  selectedCompanyId: string;
  companyStats: Map<string, { completed: number; total: number }>;
  onSelectCompany: (id: string) => void;
  searchQuery?: string;
  onCloseMobile?: () => void;
}

export function TopicSidebar({
  mode,
  topics,
  selectedTopicId,
  topicStats,
  onSelectTopic,
  companies,
  selectedCompanyId,
  companyStats,
  onSelectCompany,
  searchQuery = '',
  onCloseMobile,
}: TopicSidebarProps) {
  // In Company Wise mode, filter companies by search query
  const filteredCompanies = useMemo(() => {
    if (mode !== 'company') return companies;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return companies;

    return companies.filter((c) => c.name.toLowerCase().includes(q));
  }, [mode, companies, searchQuery]);

  return (
    <aside className="w-full h-full min-h-0 flex flex-col bg-[#101113] border-b lg:border-b-0 lg:border-r border-[#292A2E] overflow-hidden select-none">
      {/* Sidebar Header */}
      <div className="shrink-0 px-4 py-3.5 border-b border-[#292A2E] flex items-center justify-between bg-[#101113]">
        <span className="text-xs sm:text-[13px] font-semibold tracking-wider text-gray-400 uppercase">
          {mode === 'topic' ? 'Patterns & Topics' : 'Companies'}
        </span>
        <span className="text-xs text-gray-500 font-mono">
          {mode === 'topic' ? `${topics.length} total` : `${filteredCompanies.length} total`}
        </span>
      </div>

      {/* Navigation List: Independent Scroll Container */}
      <div
        className={`flex-1 min-h-0 overflow-y-auto p-2 sm:p-2.5 flex flex-col gap-1 sm:gap-1.5 overscroll-contain ${
          mode === 'company' ? 'company-scrollbar' : 'custom-scrollbar'
        }`}
      >
        {mode === 'topic' ? (
          // Topic Wise Mode
          topics.map((topic) => {
            const isSelected = selectedTopicId === topic.id;
            const stats = topicStats.get(topic.id) || { completed: 0, total: 0 };
            const isAllCompleted = stats.total > 0 && stats.completed === stats.total;

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => {
                  onSelectTopic(topic.id);
                  onCloseMobile?.();
                }}
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
          })
        ) : (
          // Company Wise Mode
          filteredCompanies.map((company, index) => {
            const isSelected = selectedCompanyId === company.id;
            const stats = companyStats.get(company.id) || {
              completed: 0,
              total: company.totalCount,
            };
            const isAllCompleted = stats.total > 0 && stats.completed === stats.total;

            return (
              <button
                key={company.id}
                type="button"
                onClick={() => {
                  onSelectCompany(company.id);
                  onCloseMobile?.();
                }}
                className={`w-full text-left flex items-center justify-between px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-md cursor-pointer transition-all whitespace-nowrap lg:whitespace-normal ${
                  isSelected
                    ? 'bg-[#17181B] text-gray-100 font-medium border border-[#292A2E]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#17181B]/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <span className="text-xs sm:text-sm truncate">
                    <span className="text-gray-500 text-xs font-mono mr-1.5">
                      {index + 1}.
                    </span>
                    {company.name}
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
                    {stats.completed}/{company.totalCount}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
