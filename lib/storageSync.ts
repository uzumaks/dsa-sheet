const COMPLETED_STORAGE_KEY = 'dsa_completed_status_v1';
const NOTES_STORAGE_KEY = 'dsa_notes_content_v1';

/**
 * Synchronously read completed problem IDs from localStorage
 */
export function getStoredCompletedMap(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(COMPLETED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to read completed map from localStorage:', err);
    return {};
  }
}

/**
 * Synchronously save completed status for a problem ID
 */
export function saveStoredCompletedStatus(problemId: string, completed: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    const map = getStoredCompletedMap();
    if (completed) {
      map[problemId] = true;
    } else {
      delete map[problemId];
    }
    localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.error('Failed to save completion status to localStorage:', err);
  }
}

/**
 * Synchronously read notes map from localStorage
 */
export function getStoredNotesMap(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to read notes from localStorage:', err);
    return {};
  }
}

/**
 * Synchronously save notes for a problem ID
 */
export function saveStoredNote(problemId: string, notes: string): void {
  if (typeof window === 'undefined') return;
  try {
    const map = getStoredNotesMap();
    if (notes && notes.trim().length > 0) {
      map[problemId] = notes;
    } else {
      delete map[problemId];
    }
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.error('Failed to save notes to localStorage:', err);
  }
}
