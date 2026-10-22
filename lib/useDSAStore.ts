'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from './db';
import { seedDatabaseIfEmpty } from './seed';
import {
  Topic,
  Problem,
  DifficultyFilter,
  StatusFilter,
  SortOption,
  Difficulty,
  TrackerMode,
  Company,
  CompanyProblem,
  DisplayProblem,
} from './types';
import { validateNote, checkStorageQuota, StorageStatus } from './storageSafety';
import {
  getStoredCompletedMap,
  saveStoredCompletedStatus,
  getStoredNotesMap,
  saveStoredNote,
  getStoredTrackerMode,
  saveStoredTrackerMode,
  getStoredCompanyId,
  saveStoredCompanyId,
} from './storageSync';
import companyDataRaw from './companyData.json';

// Companies are already canonical and sorted alphabetically in companyData.json
const initialCompanies: Company[] = companyDataRaw.companies as Company[];

export function useDSAStore() {
  // Mode state: 'topic' | 'company'
  const [mode, setModeState] = useState<TrackerMode>('topic');

  // Topic Wise state
  const [topics, setTopics] = useState<Topic[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('topic-1-hash-map-hash-set');

  // Company Wise state
  const [companies] = useState<Company[]>(initialCompanies);
  const [companyProblems, setCompanyProblems] = useState<CompanyProblem[]>([]);
  const [selectedCompanyId, setSelectedCompanyIdState] = useState<string>(
    initialCompanies[0]?.id || 'company-google'
  );
  const [companyTopicFilter, setCompanyTopicFilter] = useState<string>('all');

  // Search input & debounced search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  // Shared filters & sorting
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [storageStatus, setStorageStatus] = useState<StorageStatus | null>(null);

  // Debounce search query by 100ms for smooth 60fps typing without UI freezing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 100);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load and hydrate stored progress on mount
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      const savedMode = getStoredTrackerMode();
      setModeState(savedMode);

      const savedCompanyId = getStoredCompanyId();
      if (savedCompanyId && initialCompanies.some((c) => c.id === savedCompanyId)) {
        setSelectedCompanyIdState(savedCompanyId);
      } else if (initialCompanies.length > 0) {
        setSelectedCompanyIdState(initialCompanies[0].id);
      }

      await seedDatabaseIfEmpty(db);
      const loadedTopics = await db.topics.orderBy('order').toArray();
      const loadedProblems = await db.problems.orderBy('order').toArray();

      const localCompletedMap = getStoredCompletedMap();
      const localNotesMap = getStoredNotesMap();

      // Merge topic problems
      const mergedProblems = loadedProblems.map((p) => ({
        ...p,
        completed:
          localCompletedMap[p.id] !== undefined ? Boolean(localCompletedMap[p.id]) : p.completed,
        notes: localNotesMap[p.id] !== undefined ? localNotesMap[p.id] : p.notes || '',
      }));

      // Merge company problems
      const rawProblems = companyDataRaw.problems as unknown as Omit<CompanyProblem, 'completed' | 'notes'>[];
      const mergedCompanyProblems: CompanyProblem[] = rawProblems.map((p) => ({
        ...p,
        completed:
          localCompletedMap[p.id] !== undefined ? Boolean(localCompletedMap[p.id]) : false,
        notes: localNotesMap[p.id] !== undefined ? localNotesMap[p.id] : '',
      }));

      setTopics(loadedTopics);
      setProblems(mergedProblems);
      setCompanyProblems(mergedCompanyProblems);

      if (loadedTopics.length > 0) {
        setSelectedTopicId((prev) => {
          if (prev && loadedTopics.some((t) => t.id === prev)) {
            return prev;
          }
          return loadedTopics[0].id;
        });
      }

      const status = await checkStorageQuota();
      setStorageStatus(status);
    } catch (err: unknown) {
      console.error('Data loading error:', err);
      setDbError(err instanceof Error ? err.message : 'Failed to access browser storage.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Mode toggler
  const setMode = useCallback((newMode: TrackerMode) => {
    setModeState(newMode);
    saveStoredTrackerMode(newMode);
  }, []);

  // Company selection (explicit user action saves to localStorage)
  const setSelectedCompanyId = useCallback((companyId: string) => {
    setSelectedCompanyIdState(companyId);
    saveStoredCompanyId(companyId);
    setCompanyTopicFilter('all');
  }, []);

  // Pre-group company problems by companyId for O(1) instant lookup
  const companyProblemsMap = useMemo(() => {
    const map = new Map<string, CompanyProblem[]>();
    for (let i = 0; i < companyProblems.length; i++) {
      const p = companyProblems[i];
      const list = map.get(p.companyId);
      if (list) {
        list.push(p);
      } else {
        map.set(p.companyId, [p]);
      }
    }
    return map;
  }, [companyProblems]);

  // Pre-indexed searchable records for topic problems
  const topicSearchIndex = useMemo(() => {
    return problems.map((p) => ({
      problem: p,
      titleLower: p.title.toLowerCase(),
    }));
  }, [problems]);

  // Pre-indexed company names for fast company search
  const companySearchIndex = useMemo(() => {
    return companies.map((c) => ({
      company: c,
      nameLower: c.name.toLowerCase(),
    }));
  }, [companies]);

  // Fast score function for search matching
  const getMatchScore = useCallback((textLower: string, q: string): number => {
    if (textLower === q) return 100;
    if (textLower.startsWith(q)) return 80;
    if (textLower.includes(' ' + q)) return 60;
    if (textLower.includes(q)) return 30;
    return 0;
  }, []);

  // Auto-selection based on debounced search query
  useEffect(() => {
    if (!debouncedQuery) return;
    const q = debouncedQuery.toLowerCase();

    if (mode === 'topic') {
      let bestScore = 0;
      let bestTopicId = '';
      for (let i = 0; i < topicSearchIndex.length; i++) {
        const item = topicSearchIndex[i];
        const score = getMatchScore(item.titleLower, q);
        if (score > bestScore) {
          bestScore = score;
          bestTopicId = item.problem.topicId;
          if (score === 100) break;
        }
      }
      if (bestTopicId && bestTopicId !== selectedTopicId) {
        setSelectedTopicId(bestTopicId);
      }
    } else {
      // Company Wise mode: searches COMPANY NAMES ONLY
      let bestScore = 0;
      let bestCompanyId = '';
      for (let i = 0; i < companySearchIndex.length; i++) {
        const item = companySearchIndex[i];
        const score = getMatchScore(item.nameLower, q);
        if (score > bestScore) {
          bestScore = score;
          bestCompanyId = item.company.id;
          if (score === 100) break;
        }
      }
      if (bestCompanyId && bestCompanyId !== selectedCompanyId) {
        setSelectedCompanyIdState(bestCompanyId);
      }
    }
  }, [
    debouncedQuery,
    mode,
    topicSearchIndex,
    companySearchIndex,
    selectedTopicId,
    selectedCompanyId,
    getMatchScore,
  ]);

  // Toggle problem completion
  const toggleComplete = useCallback(async (problemId: string) => {
    const now = Date.now();
    let nextStatus = false;

    if (problemId.startsWith('company-')) {
      setCompanyProblems((prev) => {
        const current = prev.find((p) => p.id === problemId);
        nextStatus = current ? !current.completed : true;
        saveStoredCompletedStatus(problemId, nextStatus);
        return prev.map((p) =>
          p.id === problemId ? { ...p, completed: nextStatus } : p
        );
      });
      return;
    }

    setProblems((prev) => {
      const current = prev.find((p) => p.id === problemId);
      nextStatus = current ? !current.completed : true;
      saveStoredCompletedStatus(problemId, nextStatus);
      return prev.map((p) =>
        p.id === problemId ? { ...p, completed: nextStatus, updatedAt: now } : p
      );
    });

    try {
      await db.problems.update(problemId, { completed: nextStatus, updatedAt: now });
    } catch (err) {
      console.warn('Dexie update problem complete failed (localStorage is safe):', err);
    }
  }, []);

  // Update notes
  const updateNotes = useCallback(async (problemId: string, notes: string) => {
    const validation = validateNote(notes);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const now = Date.now();
    saveStoredNote(problemId, notes);

    if (problemId.startsWith('company-')) {
      setCompanyProblems((prev) =>
        prev.map((p) => (p.id === problemId ? { ...p, notes } : p))
      );
      return;
    }

    setProblems((prev) =>
      prev.map((p) => (p.id === problemId ? { ...p, notes, updatedAt: now } : p))
    );

    try {
      await db.problems.update(problemId, { notes, updatedAt: now });
    } catch (err) {
      console.warn('Dexie update notes failed (localStorage is safe):', err);
    }

    if (Math.random() < 0.2) {
      checkStorageQuota().then(setStorageStatus).catch(() => {});
    }
  }, []);

  // Topic stats: Map<topicId, { completed: number, total: number }>
  const topicStats = useMemo(() => {
    const map = new Map<string, { completed: number; total: number }>();
    topics.forEach((t) => map.set(t.id, { completed: 0, total: 0 }));

    for (let i = 0; i < problems.length; i++) {
      const p = problems[i];
      const current = map.get(p.topicId) || { completed: 0, total: 0 };
      current.total += 1;
      if (p.completed) current.completed += 1;
      map.set(p.topicId, current);
    }

    return map;
  }, [topics, problems]);

  // Company stats: Map<companyId, { completed: number, total: number }>
  const companyStats = useMemo(() => {
    const map = new Map<string, { completed: number; total: number }>();
    companies.forEach((c) => map.set(c.id, { completed: 0, total: c.totalCount }));

    for (let i = 0; i < companyProblems.length; i++) {
      const p = companyProblems[i];
      const current = map.get(p.companyId);
      if (current && p.completed) {
        current.completed += 1;
      }
    }

    return map;
  }, [companies, companyProblems]);

  // Unique topics for selected company
  const availableCompanyTopics = useMemo(() => {
    if (mode !== 'company') return [];
    const compProblems = companyProblemsMap.get(selectedCompanyId) || [];
    const set = new Set<string>();
    for (let i = 0; i < compProblems.length; i++) {
      const p = compProblems[i];
      for (let j = 0; j < p.topics.length; j++) {
        const trimmed = p.topics[j].trim();
        if (trimmed) set.add(trimmed);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [mode, companyProblemsMap, selectedCompanyId]);

  // Total counts based on mode
  const totalCompletedCount = useMemo(() => {
    if (mode === 'topic') {
      return problems.filter((p) => p.completed).length;
    }
    return companyProblems.filter((p) => p.completed).length;
  }, [mode, problems, companyProblems]);

  const totalProblemsCount = useMemo(() => {
    if (mode === 'topic') {
      return problems.length;
    }
    return companyProblems.length;
  }, [mode, problems, companyProblems]);

  // Displayed problems derivation
  const displayedProblems: DisplayProblem[] = useMemo(() => {
    const isSearching = debouncedQuery.length > 0;
    const q = debouncedQuery.toLowerCase();

    let list: DisplayProblem[] = [];

    if (mode === 'topic') {
      if (isSearching) {
        // Global search across ALL topics for problem titles
        const scored: { problem: Problem; score: number }[] = [];
        for (let i = 0; i < topicSearchIndex.length; i++) {
          const item = topicSearchIndex[i];
          const score = getMatchScore(item.titleLower, q);
          if (score > 0) {
            scored.push({ problem: item.problem, score });
          }
        }
        if (sortOption === 'default') {
          scored.sort((a, b) => b.score - a.score || a.problem.order - b.problem.order);
        }
        list = scored.slice(0, 200).map((s) => s.problem);
      } else {
        list = problems.filter((p) => p.topicId === selectedTopicId);
      }
    } else {
      // Company Wise mode: displays the selected company's complete problem list
      list = companyProblemsMap.get(selectedCompanyId) || [];

      // Filter by company topic dropdown if set
      if (companyTopicFilter !== 'all') {
        list = list.filter((p) => p.topics && p.topics.includes(companyTopicFilter));
      }
    }

    // Filter by difficulty
    if (difficultyFilter !== 'all') {
      list = list.filter((p) => p.difficulty === difficultyFilter);
    }

    // Filter by completion status
    if (statusFilter !== 'all') {
      const isCompleted = statusFilter === 'completed';
      list = list.filter((p) => p.completed === isCompleted);
    }

    const result = [...list];
    const difficultyWeights: Record<Difficulty, number> = {
      easy: 1,
      medium: 2,
      hard: 3,
    };

    // Sorting logic
    if (mode === 'company' && sortOption === 'default') {
      // Requirement 10: In Company Wise mode, default view sorts Easy → Medium → Hard
      result.sort(
        (a, b) =>
          difficultyWeights[a.difficulty] - difficultyWeights[b.difficulty] ||
          a.order - b.order
      );
    } else if (sortOption !== 'default' || (mode === 'topic' && !isSearching)) {
      switch (sortOption) {
        case 'name-asc':
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'name-desc':
          result.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'difficulty-asc':
          result.sort((a, b) => difficultyWeights[a.difficulty] - difficultyWeights[b.difficulty]);
          break;
        case 'difficulty-desc':
          result.sort((a, b) => difficultyWeights[b.difficulty] - difficultyWeights[a.difficulty]);
          break;
        case 'completed-first':
          result.sort((a, b) => (b.completed ? 1 : 0) - (a.completed ? 1 : 0));
          break;
        case 'incomplete-first':
          result.sort((a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0));
          break;
        case 'default':
        default:
          result.sort((a, b) => a.order - b.order);
          break;
      }
    }

    return result;
  }, [
    mode,
    problems,
    selectedTopicId,
    selectedCompanyId,
    companyProblemsMap,
    topicSearchIndex,
    debouncedQuery,
    companyTopicFilter,
    difficultyFilter,
    statusFilter,
    sortOption,
    getMatchScore,
  ]);

  const toggleNotes = useCallback((problemId: string) => {
    setExpandedNotesId((prev) => (prev === problemId ? null : problemId));
  }, []);

  const activeTopic = useMemo(
    () => topics.find((t) => t.id === selectedTopicId),
    [topics, selectedTopicId]
  );

  const activeCompany = useMemo(
    () => companies.find((c) => c.id === selectedCompanyId) || companies[0],
    [companies, selectedCompanyId]
  );

  return {
    mode,
    setMode,
    topics,
    problems,
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
    debouncedQuery,
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
    // Actions
    toggleComplete,
    updateNotes,
    // Stats & processed
    totalProblemsCount,
    totalCompletedCount,
    topicStats,
    companyStats,
    displayedProblems,
    activeTopic,
  };
}

export type DSAStore = ReturnType<typeof useDSAStore>;
