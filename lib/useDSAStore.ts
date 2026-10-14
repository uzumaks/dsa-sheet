import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from './db';
import { seedDatabaseIfEmpty } from './seed';
import { Topic, Problem, DifficultyFilter, StatusFilter, SortOption, Difficulty } from './types';
import { validateNote, checkStorageQuota, StorageStatus } from './storageSafety';

export function useDSAStore() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('topic-1-hash-map-hash-set');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [storageStatus, setStorageStatus] = useState<StorageStatus | null>(null);

  // Load from Dexie and seed if empty
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      await seedDatabaseIfEmpty(db);

      const loadedTopics = await db.topics.orderBy('order').toArray();
      const loadedProblems = await db.problems.orderBy('order').toArray();

      setTopics(loadedTopics);
      setProblems(loadedProblems);

      // Default selected topic to first available if current invalid
      if (loadedTopics.length > 0) {
        setSelectedTopicId((prev) => {
          if (prev && loadedTopics.some((t) => t.id === prev)) {
            return prev;
          }
          return loadedTopics[0].id;
        });
      }
      // Check browser storage health
      const status = await checkStorageQuota();
      setStorageStatus(status);
    } catch (err: unknown) {
      console.error('IndexedDB loading error:', err);
      setDbError(err instanceof Error ? err.message : 'Failed to access browser storage.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Topic actions
  const addTopic = useCallback(async (name: string): Promise<string> => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Topic name cannot be empty');

    const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36);
    const maxOrder = topics.reduce((max, t) => Math.max(max, t.order), 0);
    const now = Date.now();

    const newTopic: Topic = {
      id,
      name: trimmed,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    };

    await db.topics.add(newTopic);
    setTopics((prev) => [...prev, newTopic]);
    setSelectedTopicId(id);
    return id;
  }, [topics]);

  const renameTopic = useCallback(async (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    const now = Date.now();
    await db.topics.update(id, { name: trimmed, updatedAt: now });
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: trimmed, updatedAt: now } : t))
    );
  }, []);

  const deleteTopic = useCallback(async (id: string) => {
    await db.transaction('rw', db.topics, db.problems, async () => {
      await db.topics.delete(id);
      await db.problems.where('topicId').equals(id).delete();
    });

    setTopics((prev) => {
      const remaining = prev.filter((t) => t.id !== id);
      if (selectedTopicId === id && remaining.length > 0) {
        setSelectedTopicId(remaining[0].id);
      }
      return remaining;
    });

    setProblems((prev) => prev.filter((p) => p.topicId !== id));
  }, [selectedTopicId]);

  // Problem actions
  const toggleComplete = useCallback(async (problemId: string) => {
    let nextStatus = false;
    const now = Date.now();

    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          nextStatus = !p.completed;
          return { ...p, completed: nextStatus, updatedAt: now };
        }
        return p;
      })
    );

    await db.problems.update(problemId, { completed: nextStatus, updatedAt: now });
  }, []);

  const updateNotes = useCallback(async (problemId: string, notes: string) => {
    // Safety check: validate length and format to prevent browser lag / IDB overflow
    const validation = validateNote(notes);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const now = Date.now();
    setProblems((prev) =>
      prev.map((p) => (p.id === problemId ? { ...p, notes, updatedAt: now } : p))
    );
    await db.problems.update(problemId, { notes, updatedAt: now });

    // Periodically re-check storage estimate
    if (Math.random() < 0.2) {
      checkStorageQuota().then(setStorageStatus).catch(() => {});
    }
  }, []);

  const addProblem = useCallback(
    async (data: { title: string; url?: string; topicId: string; difficulty: Difficulty }) => {
      const trimmedTitle = data.title.trim();
      if (!trimmedTitle) throw new Error('Problem title is required');

      const id = 'prob-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
      const existingInTopic = problems.filter((p) => p.topicId === data.topicId);
      const maxOrder = existingInTopic.reduce((max, p) => Math.max(max, p.order), 0);
      const now = Date.now();

      const newProblem: Problem = {
        id,
        title: trimmedTitle,
        url: data.url?.trim() || undefined,
        topicId: data.topicId,
        difficulty: data.difficulty,
        completed: false,
        notes: '',
        order: maxOrder + 1,
        createdAt: now,
        updatedAt: now,
      };

      await db.problems.add(newProblem);
      setProblems((prev) => [...prev, newProblem]);
      return newProblem;
    },
    [problems]
  );

  const editProblem = useCallback(
    async (
      id: string,
      data: { title: string; url?: string; topicId: string; difficulty: Difficulty }
    ) => {
      const trimmedTitle = data.title.trim();
      if (!trimmedTitle) return;

      const now = Date.now();
      const updates = {
        title: trimmedTitle,
        url: data.url?.trim() || undefined,
        topicId: data.topicId,
        difficulty: data.difficulty,
        updatedAt: now,
      };

      await db.problems.update(id, updates);
      setProblems((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    },
    []
  );

  const deleteProblem = useCallback(async (id: string) => {
    await db.problems.delete(id);
    setProblems((prev) => prev.filter((p) => p.id !== id));
    if (expandedNotesId === id) {
      setExpandedNotesId(null);
    }
  }, [expandedNotesId]);

  // Overall stats
  const totalProblemsCount = problems.length;
  const totalCompletedCount = useMemo(
    () => problems.filter((p) => p.completed).length,
    [problems]
  );

  // Per topic completion counts: Map<topicId, { completed: number, total: number }>
  const topicStats = useMemo(() => {
    const map = new Map<string, { completed: number; total: number }>();
    topics.forEach((t) => map.set(t.id, { completed: 0, total: 0 }));

    problems.forEach((p) => {
      const current = map.get(p.topicId) || { completed: 0, total: 0 };
      current.total += 1;
      if (p.completed) current.completed += 1;
      map.set(p.topicId, current);
    });

    return map;
  }, [topics, problems]);

  // Filtered and sorted problems for active view
  const displayedProblems = useMemo(() => {
    // 1. Filter by selected topic (unless search has text and user wants to match across, but spec: "Selecting a topic displays its associated problems. Search: Match problem names. Work together with topic selection and difficulty filters.")
    let list = problems.filter((p) => p.topicId === selectedTopicId);

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    // 3. Filter by difficulty
    if (difficultyFilter !== 'all') {
      list = list.filter((p) => p.difficulty === difficultyFilter);
    }

    // 4. Filter by completion status
    if (statusFilter !== 'all') {
      const isCompleted = statusFilter === 'completed';
      list = list.filter((p) => p.completed === isCompleted);
    }

    // 5. Sorting (without mutating original stored order)
    const result = [...list];
    const difficultyWeights: Record<Difficulty, number> = {
      easy: 1,
      medium: 2,
      hard: 3,
    };

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

    return result;
  }, [problems, selectedTopicId, searchQuery, difficultyFilter, statusFilter, sortOption]);

  const toggleNotes = useCallback((problemId: string) => {
    setExpandedNotesId((prev) => (prev === problemId ? null : problemId));
  }, []);

  return {
    topics,
    problems,
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
    // Actions
    addTopic,
    renameTopic,
    deleteTopic,
    toggleComplete,
    updateNotes,
    addProblem,
    editProblem,
    deleteProblem,
    // Stats & processed
    totalProblemsCount,
    totalCompletedCount,
    topicStats,
    displayedProblems,
    activeTopic: topics.find((t) => t.id === selectedTopicId),
  };
}

export type DSAStore = ReturnType<typeof useDSAStore>;
