import Dexie, { type EntityTable } from 'dexie';
import { Topic, Problem } from './types';

export class DSADatabase extends Dexie {
  topics!: EntityTable<Topic, 'id'>;
  problems!: EntityTable<Problem, 'id'>;

  constructor() {
    super('DSATrackerDB');
    this.version(1).stores({
      topics: 'id, order, name',
      problems: 'id, topicId, difficulty, completed, order, title',
    });
  }
}

export const db = new DSADatabase();
