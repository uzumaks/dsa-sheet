export type Difficulty = 'easy' | 'medium' | 'hard';

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
  createdAt: number;
  updatedAt: number;
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
