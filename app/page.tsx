'use client';

import React from 'react';
import { useDSAStore } from '@/lib/useDSAStore';
import { AppHeader } from '@/components/AppHeader';
import { TopicSidebar } from '@/components/TopicSidebar';
import { DifficultyFilter } from '@/components/DifficultyFilter';
import { ProblemList } from '@/components/ProblemList';
import { Loader2, AlertCircle, AlertTriangle } from 'lucide-react';

export default function Home() {
  const {
    topics,
    selectedTopicId,
    setSelectedTopicId,
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
    displayedProblems,
    activeTopic,
  } = useDSAStore();

  if (isLoading) {
    return (
      <div className="h-screen bg-[#101113] flex flex-col items-center justify-center text-gray-400 gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
        <span className="text-xs font-mono tracking-wider text-gray-400">
          Loading 41 LeetCode Patterns...
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

  return (
    <div className="h-screen flex flex-col bg-[#101113] text-gray-200 overflow-hidden">
      {/* Restrained Application Header (Fixed Top) */}
      <div className="shrink-0">
        <AppHeader
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

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row max-w-7xl w-full mx-auto overflow-hidden">
        {/* Topic Sidebar (Independent Scroll Container) */}
        <TopicSidebar
          topics={topics}
          selectedTopicId={selectedTopicId}
          topicStats={topicStats}
          onSelectTopic={(id) => {
            setSelectedTopicId(id);
          }}
        />

        {/* Problem List Main View (Independent Scroll Container) */}
        <main className="flex-1 min-h-0 h-full flex flex-col min-w-0 bg-[#141518] overflow-hidden">
          {/* Active Topic Header bar */}
          <div className="shrink-0 px-4 sm:px-6 py-3.5 bg-[#101113] border-b border-[#292A2E] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm sm:text-base font-semibold text-gray-100">
                {activeTopic ? `${activeTopic.order}. ${activeTopic.name}` : 'All Problems'}
              </h2>
              {activeTopic && (
                <span className="text-xs sm:text-sm text-gray-400 tabular-nums">
                  ({(topicStats.get(activeTopic.id)?.completed || 0)} / {(topicStats.get(activeTopic.id)?.total || 0)} completed)
                </span>
              )}
            </div>
          </div>

          {/* Compact Filter Toolbar */}
          <div className="shrink-0">
            <DifficultyFilter
              difficulty={difficultyFilter}
              onDifficultyChange={setDifficultyFilter}
              status={statusFilter}
              onStatusChange={setStatusFilter}
              sort={sortOption}
              onSortChange={setSortOption}
              totalShown={displayedProblems.length}
            />
          </div>

          {/* Main Problem List with Independent Smooth Scroll */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar overscroll-contain">
            <ProblemList
              problems={displayedProblems}
              activeTopic={activeTopic}
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
