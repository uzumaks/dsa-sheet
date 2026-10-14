import { DSADatabase } from './db';
import { Topic, Problem } from './types';
import seedData from './seedData.json';

export async function seedDatabaseIfEmpty(db: DSADatabase): Promise<void> {
  const currentProblemCount = await db.problems.count();
  const targetProblemCount = seedData.problems.length;

  // If already at full target count, don't re-seed
  if (currentProblemCount === targetProblemCount) {
    return;
  }

  // If there are existing records (e.g. from previous small seed), preserve user work!
  const existingNotesAndStatus = new Map<string, { completed: boolean; notes: string }>();

  if (currentProblemCount > 0) {
    const existingProblems = await db.problems.toArray();
    for (const p of existingProblems) {
      if (p.completed || (p.notes && p.notes.trim().length > 0)) {
        const key = p.url ? p.url.toLowerCase() : p.title.toLowerCase();
        existingNotesAndStatus.set(key, {
          completed: p.completed,
          notes: p.notes,
        });
      }
    }
  }

  const now = Date.now();
  const topicsToInsert: Topic[] = seedData.topics.map((t) => ({
    id: t.id,
    name: t.name,
    order: t.order,
    createdAt: now,
    updatedAt: now,
  }));

  const problemsToInsert: Problem[] = seedData.problems.map((p) => {
    const key = p.url ? p.url.toLowerCase() : p.title.toLowerCase();
    const preserved = existingNotesAndStatus.get(key);

    return {
      id: p.id,
      topicId: p.topicId,
      title: p.title,
      url: p.url,
      difficulty: p.difficulty as 'easy' | 'medium' | 'hard',
      completed: preserved?.completed ?? false,
      notes: preserved?.notes ?? '',
      order: p.order,
      createdAt: now,
      updatedAt: now,
    };
  });

  await db.transaction('rw', db.topics, db.problems, async () => {
    await db.topics.clear();
    await db.problems.clear();
    await db.topics.bulkAdd(topicsToInsert);
    await db.problems.bulkAdd(problemsToInsert);
  });
}
