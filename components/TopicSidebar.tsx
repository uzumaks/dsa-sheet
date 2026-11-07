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
    <aside className="w-full h-full min-h-0 flex flex-col bg-[#101113] border-b lg:border-b-0 lg:border-r border-[#25272C] overflow-hidden select-none">
      {/* Sidebar Header */}
      <div className="shrink-0 px-4 py-3 border-b border-[#25272C] flex items-center justify-between bg-[#101113]">
        <span className="text-xs font-pretty-mono font-[300] tracking-widest text-emerald-400/90 uppercase">
          {mode === 'topic' ? '41 Patterns' : '423 Companies'}
        </span>
        <span className="text-xs font-pretty-mono font-[300] text-gray-500">
          {mode === 'topic' ? `${topics.length} total` : `${filteredCompanies.length} shown`}
        </span>
      </div>

      {/* Navigation List: Independent Scroll Container */}
      <div
        className={`flex-1 min-h-0 overflow-y-auto p-2 sm:p-2.5 flex flex-col gap-1 overscroll-contain ${
          mode === 'company' ? 'company-scrollbar' : 'custom-scrollbar'
        }`}
      >
        {mode === 'topic' ? (
          // Topic / Pattern Wise Mode
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
                className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all whitespace-nowrap lg:whitespace-normal ${
                  isSelected
                    ? 'bg-[#17181B] text-gray-100 font-[400] border border-[#292A2E] shadow-xs'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#17181B]/70 border border-transparent font-[300]'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <span className="text-gray-500 text-xs font-pretty-mono font-[300] shrink-0">
                    {topic.order}.
                  </span>
                  <span className="text-xs sm:text-[13px] font-normal tracking-normal truncate text-gray-200 group-hover:text-white">
                    {topic.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-xs tabular-nums font-pretty-mono font-[300] ${
                      isAllCompleted
                        ? 'text-emerald-400'
                        : isSelected
                        ? 'text-gray-300'
                        : 'text-gray-600'
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
                className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all whitespace-nowrap lg:whitespace-normal ${
                  isSelected
                    ? 'bg-[#17181B] text-gray-100 font-[400] border border-[#292A2E] shadow-xs'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#17181B]/70 border border-transparent font-[300]'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <span className="text-gray-500 text-xs font-pretty-mono font-[300] shrink-0">
                    {index + 1}.
                  </span>
                  <span className="text-xs sm:text-[13px] font-normal tracking-normal truncate text-gray-200 group-hover:text-white">
                    {company.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-xs tabular-nums font-pretty-mono font-[300] ${
                      isAllCompleted
                        ? 'text-emerald-400'
                        : isSelected
                        ? 'text-gray-300'
                        : 'text-gray-600'
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
