'use client';

import React, { useState } from 'react';
import { useDSAStore } from '@/lib/useDSAStore';
import { AppHeader } from '@/components/AppHeader';
import { TopicSidebar } from '@/components/TopicSidebar';
import { DifficultyFilter } from '@/components/DifficultyFilter';
import { ProblemList } from '@/components/ProblemList';
import { Loader2, AlertCircle, AlertTriangle, Menu, X } from 'lucide-react';

export default function Home() {
  const {
    mode,
    setMode,
    topics,
    selectedTopicId,
    setSelectedTopicId,
    companies,
    selectedCompanyId,
    setSelectedCompanyId,
    activeCompany,
    companyTopicFilter,
    setCompanyTopicFilter,
    availableCompanyTopics,
    searchQuery,
    setSearchQuery,
    difficultyFilter,
    setDifficultyFilter,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    expandedNotesId,
    toggleNotes,
    isLoading,
    dbError,
    storageStatus,
    toggleComplete,
    updateNotes,
    totalProblemsCount,
    totalCompletedCount,
    topicStats,
    companyStats,
    displayedProblems,
    activeTopic,
  } = useDSAStore();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="h-screen bg-[#101113] flex flex-col items-center justify-center text-gray-400 gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
        <span className="text-xs font-mono tracking-wider text-gray-400">
          Loading DSASheeeet...
        </span>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="h-screen bg-[#101113] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 bg-[#1E1415] border border-red-900/50 rounded-lg max-w-md text-red-300 text-xs">
          <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <p className="font-semibold mb-1">Database Access Error</p>
          <p className="text-gray-400">{dbError}</p>
          <p className="mt-2 text-gray-400 text-[11px]">
            Please ensure IndexedDB is supported and cookies/local storage are allowed in your browser.
          </p>
        </div>
      </div>
    );
  }

  const activeTitle =
    mode === 'topic'
      ? activeTopic
        ? `${activeTopic.order}. ${activeTopic.name}`
        : 'All Problems'
      : activeCompany
      ? activeCompany.name
      : 'All Companies';

  const activeStats =
    mode === 'topic'
      ? activeTopic
        ? topicStats.get(activeTopic.id)
        : null
      : activeCompany
      ? companyStats.get(activeCompany.id)
      : null;

  const isTopicSearching = mode === 'topic' && searchQuery.trim().length > 0;

  return (
    <div className="h-screen flex flex-col bg-[#101113] text-gray-200 overflow-hidden">
      {/* Restrained Application Header with Mode Toggle (Fixed Top) */}
      <div className="shrink-0">
        <AppHeader
          mode={mode}
          onModeChange={(newMode) => {
            setMode(newMode);
            setIsMobileNavOpen(false);
          }}
          completedCount={totalCompletedCount}
          totalCount={totalProblemsCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Storage warning banner if browser quota is near capacity */}
      {storageStatus?.isLowSpace && (
        <div className="shrink-0 bg-amber-950/70 border-b border-amber-800/60 px-4 py-2 text-xs text-amber-200 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Browser storage is nearing capacity ({storageStatus.percentUsed}% used). Consider trimming lengthy notes to ensure fast performance.
          </span>
        </div>
      )}

      {/* Mobile Topic/Company Selector trigger bar (visible only on mobile/tablet < lg) */}
      <div className="lg:hidden shrink-0 flex items-center justify-between px-3.5 py-2 bg-[#141518] border-b border-[#292A2E]">
        <button
          type="button"
          onClick={() => setIsMobileNavOpen(true)}
          className="flex items-center gap-2 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer select-none"
        >
          <Menu className="w-4 h-4 text-emerald-400" />
          <span className="font-medium truncate max-w-[220px]">
            {mode === 'topic' ? 'Pattern:' : 'Company:'} {activeTitle}
          </span>
          {activeStats && (
            <span className="text-gray-500 font-mono text-[11px]">
              ({activeStats.completed}/{activeStats.total})
            </span>
          )}
        </button>

        <span className="text-[11px] text-gray-500 font-mono">
          Tap to switch
        </span>
      </div>

      {/* Mobile Slide-over Drawer Backdrop & Drawer */}
      {isMobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileNavOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs h-full bg-[#101113] border-r border-[#292A2E] z-10 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#292A2E]">
              <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase">
                {mode === 'topic' ? 'Select Pattern' : 'Select Company'}
              </span>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-200 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              <TopicSidebar
                mode={mode}
                topics={topics}
                selectedTopicId={selectedTopicId}
                topicStats={topicStats}
                onSelectTopic={(id) => {
                  setSelectedTopicId(id);
                  setIsMobileNavOpen(false);
                }}
                companies={companies}
                selectedCompanyId={selectedCompanyId}
                companyStats={companyStats}
                onSelectCompany={(id) => {
                  setSelectedCompanyId(id);
                  setIsMobileNavOpen(false);
                }}
                searchQuery={searchQuery}
                onCloseMobile={() => setIsMobileNavOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Container: Desktop Sidebar + Content */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row max-w-7xl w-full mx-auto overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile, visible on lg+) */}
        <div className="hidden lg:flex shrink-0 w-72 xl:w-80 h-full min-h-0 overflow-hidden">
          <TopicSidebar
            mode={mode}
            topics={topics}
            selectedTopicId={selectedTopicId}
            topicStats={topicStats}
            onSelectTopic={setSelectedTopicId}
            companies={companies}
            selectedCompanyId={selectedCompanyId}
            companyStats={companyStats}
            onSelectCompany={setSelectedCompanyId}
            searchQuery={searchQuery}
          />
        </div>

        {/* Problem List Main View (Independent Scroll Container) */}
        <main className="flex-1 min-h-0 h-full flex flex-col min-w-0 bg-[#141518] overflow-hidden">
          {/* Active Header bar */}
          <div className="h-11 shrink-0 px-3.5 sm:px-6 bg-[#101113] border-b border-[#292A2E] flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <h2 className="text-xs sm:text-sm font-semibold text-gray-100 truncate">
                {isTopicSearching ? `Search: "${searchQuery}"` : activeTitle}
              </h2>
              {activeStats && !isTopicSearching && (
                <span className="text-xs text-gray-400 tabular-nums shrink-0">
                  ({activeStats.completed} / {activeStats.total} completed)
                </span>
              )}
            </div>
            {isTopicSearching && (
              <span className="text-xs text-gray-400 tabular-nums shrink-0 font-mono">
                {displayedProblems.length} results
              </span>
            )}
          </div>

          {/* Compact Filter Toolbar with Custom Topic Dropdown */}
          <div className="shrink-0">
            <DifficultyFilter
              difficulty={difficultyFilter}
              onDifficultyChange={setDifficultyFilter}
              status={statusFilter}
              onStatusChange={setStatusFilter}
              sort={sortOption}
              onSortChange={setSortOption}
              totalShown={displayedProblems.length}
              availableTopics={mode === 'company' ? availableCompanyTopics : undefined}
              selectedTopic={companyTopicFilter}
              onTopicChange={setCompanyTopicFilter}
            />
          </div>

          {/* Main Problem List with Independent Smooth Scroll */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar overscroll-contain">
            <ProblemList
              problems={displayedProblems}
              activeTopic={activeTopic}
              activeTitle={activeTitle}
              expandedNotesId={expandedNotesId}
              searchQuery={searchQuery}
              difficultyFilter={difficultyFilter}
              statusFilter={statusFilter}
              onToggleComplete={toggleComplete}
              onToggleNotes={toggleNotes}
              onSaveNotes={updateNotes}
              onClearSearch={() => setSearchQuery('')}
              onResetDifficulty={() => setDifficultyFilter('all')}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
