'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Topic, Company, TrackerMode } from '@/lib/types';
import { Layers, Building2, Flame, Award, ChevronDown, Check } from 'lucide-react';

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

const TOP_TECH_NAMES = new Set([
  'google', 'amazon', 'meta', 'microsoft', 'apple', 'uber', 'netflix',
  'adobe', 'goldman sachs', 'stripe', 'databricks', 'snowflake', 'bloomberg',
  'salesforce', 'oracle', 'linkedin', 'twitter', 'airbnb', 'nvidia'
]);

const TOPIC_TRACKS = [
  {
    id: 'track-1',
    name: 'Core Foundations',
    orders: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    id: 'track-2',
    name: 'Stacks, Queues & Heaps',
    orders: [8, 9, 10, 19, 35, 37, 38],
  },
  {
    id: 'track-3',
    name: 'Trees & Linked Lists',
    orders: [11, 12, 24, 25, 26, 32],
  },
  {
    id: 'track-4',
    name: 'Graphs & Matrix Scans',
    orders: [16, 17, 18, 30, 31],
  },
  {
    id: 'track-5',
    name: 'Dynamic Programming & Optimization',
    orders: [13, 14, 15, 20, 21, 22, 23, 27, 28, 29, 33, 34, 36, 39, 40, 41],
  },
];

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
  // Topic view mode: 'tracks' (organized clusters) vs 'all' (continuous index)
  const [topicViewMode, setTopicViewMode] = useState<'tracks' | 'all'>('tracks');
  
  // Company filter quick tier: 'all' vs 'top'
  const [companyTier, setCompanyTier] = useState<'all' | 'top'>('all');

  // Progressive rendering for company cards for instantaneous mode switching
  const COMPANY_CHUNK_SIZE = 50;
  const [visibleCompanyCount, setVisibleCompanyCount] = useState<number>(COMPANY_CHUNK_SIZE);
  const companySentinelRef = useRef<HTMLDivElement | null>(null);

  // Filter companies
  const filteredCompanies = useMemo(() => {
    if (mode !== 'company') return companies;
    let list = companies;

    // Apply quick tier filter
    if (companyTier === 'top') {
      list = list.filter((c) => TOP_TECH_NAMES.has(c.name.toLowerCase()));
    }

    // Apply search query
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;

    return list.filter((c) => c.name.toLowerCase().includes(q));
  }, [mode, companies, companyTier, searchQuery]);

  // Reset visible company count when filter or mode changes
  useEffect(() => {
    setVisibleCompanyCount(COMPANY_CHUNK_SIZE);
  }, [mode, companyTier, searchQuery]);

  // Load next batch of companies as user scrolls down sidebar
  useEffect(() => {
    if (mode !== 'company' || visibleCompanyCount >= filteredCompanies.length) return;
    const sentinel = companySentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCompanyCount((prev) => Math.min(prev + COMPANY_CHUNK_SIZE, filteredCompanies.length));
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [mode, visibleCompanyCount, filteredCompanies.length]);

  const visibleCompanies = useMemo(() => {
    if (filteredCompanies.length <= COMPANY_CHUNK_SIZE) return filteredCompanies;
    return filteredCompanies.slice(0, visibleCompanyCount);
  }, [filteredCompanies, visibleCompanyCount]);

  return (
    <aside className="w-full h-full min-h-0 flex flex-col bg-[#101113] border-b lg:border-b-0 lg:border-r border-[#25272C] overflow-hidden select-none font-pretty">
      {/* Sidebar Header Toolbar */}
      <div className="shrink-0 px-3.5 py-2.5 border-b border-[#25272C] flex items-center justify-between bg-[#101113]">
        <div className="flex items-center gap-2">
          {mode === 'topic' ? (
            <Layers className="w-3.5 h-3.5 text-emerald-400 stroke-[1.5]" />
          ) : (
            <Building2 className="w-3.5 h-3.5 text-emerald-400 stroke-[1.5]" />
          )}
          <span className="text-xs font-pretty-mono font-[300] tracking-widest text-emerald-400/90 uppercase">
            {mode === 'topic' ? '41 Patterns' : '423 Companies'}
          </span>
        </div>

        {/* View toggle / quick tier switcher */}
        {mode === 'topic' ? (
          <div className="flex items-center gap-1 bg-[#17181B] p-0.5 rounded border border-[#25272C] text-[10px] font-pretty-mono">
            <button
              type="button"
              onClick={() => setTopicViewMode('tracks')}
              className={`px-2 py-0.5 rounded transition-colors ${
                topicViewMode === 'tracks'
                  ? 'bg-[#25272C] text-emerald-400 font-[400]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Tracks
            </button>
            <button
              type="button"
              onClick={() => setTopicViewMode('all')}
              className={`px-2 py-0.5 rounded transition-colors ${
                topicViewMode === 'all'
                  ? 'bg-[#25272C] text-emerald-400 font-[400]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              All 41
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-[#17181B] p-0.5 rounded border border-[#25272C] text-[10px] font-pretty-mono">
            <button
              type="button"
              onClick={() => setCompanyTier('all')}
              className={`px-2 py-0.5 rounded transition-colors ${
                companyTier === 'all'
                  ? 'bg-[#25272C] text-emerald-400 font-[400]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              All 423
            </button>
            <button
              type="button"
              onClick={() => setCompanyTier('top')}
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                companyTier === 'top'
                  ? 'bg-[#25272C] text-emerald-400 font-[400]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Flame className="w-2.5 h-2.5" />
              <span>Top Tier</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation List: Independent Scroll Container */}
      <div
        className={`flex-1 min-h-0 overflow-y-auto p-2 sm:p-2.5 flex flex-col gap-1 overscroll-contain ${
          mode === 'company' ? 'company-scrollbar' : 'custom-scrollbar'
        }`}
      >
        {mode === 'topic' ? (
          topicViewMode === 'tracks' ? (
            // Grouped Curriculum Tracks
            <div className="flex flex-col gap-2.5">
              {TOPIC_TRACKS.map((track, trackIdx) => {
                const trackOrders = new Set(track.orders);
                const trackTopics = topics.filter((t) => trackOrders.has(t.order));
                
                // Track total & completed count
                let trackCompleted = 0;
                let trackTotal = 0;
                trackTopics.forEach((t) => {
                  const s = topicStats.get(t.id);
                  if (s) {
                    trackCompleted += s.completed;
                    trackTotal += s.total;
                  }
                });

                return (
                  <div key={track.id} className="flex flex-col">
                    {/* Track Section Heading with breathing room */}
                    <div className="px-2.5 py-1.5 flex items-center justify-between text-[10.5px] font-pretty-mono uppercase tracking-wider text-gray-400 border-b border-[#1E2024] mb-1">
                      <span className="font-[400] text-gray-300">
                        {track.name}
                      </span>
                      <span className="text-[10px] text-gray-500 tabular-nums">
                        {trackCompleted}/{trackTotal}
                      </span>
                    </div>

                    {/* Track Topics */}
                    <div className="flex flex-col gap-0.5">
                      {trackTopics.map((topic) => {
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
                            className={`w-full text-left flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition-all whitespace-nowrap lg:whitespace-normal group ${
                              isSelected
                                ? 'bg-[#18191E] border border-[#2A2C33] shadow-xs'
                                : 'hover:bg-[#16171B] border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 overflow-hidden mr-2 min-w-0">
                              <span className="text-gray-500 text-[11px] font-pretty-mono font-[300] shrink-0 w-5 tabular-nums text-right select-none mr-0.5">
                                {topic.order}.
                              </span>
                              <span
                                className={`text-xs sm:text-[13px] font-normal tracking-normal truncate transition-colors ${
                                  isSelected
                                    ? 'text-gray-100'
                                    : 'text-gray-300 group-hover:text-white'
                                }`}
                              >
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
                  </div>
                );
              })}
            </div>
          ) : (
            // Continuous Linear 41 Topics
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
                  className={`w-full text-left flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition-all whitespace-nowrap lg:whitespace-normal group ${
                    isSelected
                      ? 'bg-[#18191E] border border-[#2A2C33] shadow-xs'
                      : 'hover:bg-[#16171B] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-1.5 overflow-hidden mr-2 min-w-0">
                    <span className="text-gray-500 text-[11px] font-pretty-mono font-[300] shrink-0 w-5 tabular-nums text-right select-none mr-0.5">
                      {topic.order}.
                    </span>
                    <span
                      className={`text-xs sm:text-[13px] font-normal tracking-normal truncate transition-colors ${
                        isSelected
                          ? 'text-gray-100'
                          : 'text-gray-300 group-hover:text-white'
                      }`}
                    >
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
                          : 'text-gray-500'
                      }`}
                    >
                      {stats.completed}/{stats.total}
                    </span>
                  </div>
                </button>
              );
            })
          )
        ) : (
          // Company Cards with Monograms & Progress (Progressively Chunked)
          <>
            {visibleCompanies.map((company) => {
              const isSelected = selectedCompanyId === company.id;
              const stats = companyStats.get(company.id) || {
                completed: 0,
                total: company.totalCount,
              };
              const isAllCompleted = stats.total > 0 && stats.completed === stats.total;
              const monogram = company.name.substring(0, 2).toUpperCase();
              const percent = company.totalCount > 0 ? Math.round((stats.completed / company.totalCount) * 100) : 0;

              return (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => {
                    onSelectCompany(company.id);
                    onCloseMobile?.();
                  }}
                  className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all group ${
                    isSelected
                      ? 'bg-[#18191E] border border-[#2A2C33] shadow-xs'
                      : 'hover:bg-[#16171B] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden mr-2 min-w-0">
                    {/* Monogram Box */}
                    <div className={`w-7 h-7 rounded bg-[#1C1D21] border flex items-center justify-center font-pretty-mono text-[10px] shrink-0 transition-colors ${
                      isSelected
                        ? 'border-emerald-500/40 text-emerald-400'
                        : 'border-[#292A2E] text-gray-400 group-hover:text-gray-200'
                    }`}>
                      {monogram}
                    </div>

                    {/* Company Name & Total Count */}
                    <div className="min-w-0 truncate">
                      <div
                        className={`text-xs sm:text-[13px] font-normal tracking-normal truncate transition-colors ${
                          isSelected ? 'text-gray-100' : 'text-gray-300 group-hover:text-white'
                        }`}
                      >
                        {company.name}
                      </div>
                      <div className="text-[10px] font-pretty-mono text-gray-500">
                        {company.totalCount} problems
                      </div>
                    </div>
                  </div>

                  {/* Progress Pill / Percent */}
                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`text-xs tabular-nums font-pretty-mono font-[300] ${
                        isAllCompleted
                          ? 'text-emerald-400'
                          : isSelected
                          ? 'text-gray-300'
                          : 'text-gray-500'
                      }`}
                    >
                      {stats.completed}/{company.totalCount}
                    </span>
                    {percent > 0 && (
                      <span className="text-[9px] font-pretty-mono text-emerald-400/90">
                        {percent}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
            {visibleCompanyCount < filteredCompanies.length && (
              <div ref={companySentinelRef} className="py-2 text-center text-[10px] font-pretty-mono text-gray-500">
                Rendering {visibleCompanyCount} of {filteredCompanies.length} companies...
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
