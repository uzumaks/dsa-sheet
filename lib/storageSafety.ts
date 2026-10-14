export const MAX_NOTE_LENGTH = 15000; // ~15KB per note, plenty for code + markdown notes

export interface StorageStatus {
  usageBytes: number;
  quotaBytes: number;
  percentUsed: number;
  isLowSpace: boolean;
  isAvailable: boolean;
}

/**
 * Check browser storage quota using the native StorageManager API
 */
export async function checkStorageQuota(): Promise<StorageStatus> {
  if (typeof window === 'undefined' || !navigator.storage || !navigator.storage.estimate) {
    return {
      usageBytes: 0,
      quotaBytes: 0,
      percentUsed: 0,
      isLowSpace: false,
      isAvailable: false,
    };
  }

  try {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentUsed = quota > 0 ? (usage / quota) * 100 : 0;
    // Consider low space if > 90% full or less than 20MB remaining
    const isLowSpace = percentUsed > 90 || (quota > 0 && quota - usage < 20 * 1024 * 1024);

    return {
      usageBytes: usage,
      quotaBytes: quota,
      percentUsed: Math.round(percentUsed * 10) / 10,
      isLowSpace,
      isAvailable: true,
    };
  } catch (err) {
    console.warn('Unable to estimate storage quota:', err);
    return {
      usageBytes: 0,
      quotaBytes: 0,
      percentUsed: 0,
      isLowSpace: false,
      isAvailable: false,
    };
  }
}

/**
 * Validates and sanitizes notes before persisting to IndexedDB
 */
export function validateNote(content: string): { isValid: boolean; error?: string } {
  if (content.length > MAX_NOTE_LENGTH) {
    return {
      isValid: false,
      error: `Note exceeds the safe limit of ${MAX_NOTE_LENGTH.toLocaleString()} characters (${content.length.toLocaleString()} chars). Please trim it to keep the browser responsive.`,
    };
  }

  return { isValid: true };
}
