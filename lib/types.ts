export type Difficulty = 'easy' | 'medium' | 'hard';

export type TrackerMode = 'topic' | 'company';

export interface Topic {
  id: string;
  name: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface Problem {
  id: string;
  title: string;
  url?: string;
  topicId: string;
  difficulty: Difficulty;
  completed: boolean;
  notes: string;
  order: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface Company {
  id: string;
  name: string;
  totalCount: number;
  order: number;
}

export interface CompanyProblem {
  id: string;
  companyId: string;
  title: string;
  difficulty: Difficulty;
  url?: string;
  topics: string[];
  completed: boolean;
  notes: string;
  order: number;
}

// Unified interface consumed by ProblemRow and ProblemList
export interface DisplayProblem {
  id: string;
  title: string;
  url?: string;
  difficulty: Difficulty;
  completed: boolean;
  notes: string;
  order: number;
  topicId?: string;
  companyId?: string;
  companyName?: string;
  topics?: string[];
}

export type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';
export type StatusFilter = 'all' | 'incomplete' | 'completed';

export type SortOption =
  | 'default'
  | 'name-asc'
  | 'name-desc'
  | 'difficulty-asc'
  | 'difficulty-desc'
  | 'incomplete-first'
  | 'completed-first';
