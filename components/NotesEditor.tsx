'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Check, Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { MAX_NOTE_LENGTH } from '@/lib/storageSafety';

interface NotesEditorProps {
  problemId: string;
  initialNotes: string;
  onSaveNotes: (problemId: string, notes: string) => Promise<void>;
}

export function NotesEditor({ problemId, initialNotes, onSaveNotes }: NotesEditorProps) {
  const [content, setContent] = useState(initialNotes);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstMount = useRef(true);

  // Sync state if initialNotes changes from external source
  useEffect(() => {
    if (!isFirstMount.current) {
      setContent(initialNotes);
    }
    isFirstMount.current = false;
  }, [problemId, initialNotes]);

  // Handle content changes with debounce save
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setContent(newText);
    setSaveStatus('saving');
    setErrorMessage(null);

    if (newText.length > MAX_NOTE_LENGTH) {
      setSaveStatus('error');
      setErrorMessage(`Exceeds maximum safe note length of ${MAX_NOTE_LENGTH.toLocaleString()} chars.`);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        await onSaveNotes(problemId, newText);
        setSaveStatus('saved');
        setTimeout(() => {
          setSaveStatus('idle');
        }, 1500);
      } catch (err) {
        console.error('Failed to autosave notes:', err);
        setSaveStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Storage save error');
      }
    }, 400);
  };

  const handleClear = async () => {
    setContent('');
    setSaveStatus('saving');
    setErrorMessage(null);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    try {
      await onSaveNotes(problemId, '');
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    } catch (err) {
      setSaveStatus('error');
      setErrorMessage('Failed to clear notes');
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const charsLeft = MAX_NOTE_LENGTH - content.length;
  const isNearLimit = charsLeft < 1000;

  return (
    <div className="bg-[#131417] border-t border-[#232428] px-4 py-3 sm:px-6 transition-all duration-200">
      <div className="flex items-center justify-between pb-1.5 text-[11px] text-gray-400">
        <span className="font-medium tracking-wide text-gray-400 uppercase">
          Personal Notes &amp; Intuition
        </span>
        <div className="flex items-center gap-3">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1 text-amber-400/90 text-[11px]">
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-emerald-400/90 text-[11px]">
              <Check className="w-3 h-3" />
              Saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1 text-red-400 text-[11px]">
              <AlertTriangle className="w-3 h-3" />
              {errorMessage || 'Save error'}
            </span>
          )}
          {saveStatus === 'idle' && content && (
            <span className="text-gray-400 text-[11px]">Autosaved</span>
          )}

          {/* Character counter / DB overflow safety */}
          <span
            className={`text-[10px] tabular-nums font-mono ${
              isNearLimit ? 'text-amber-400 font-semibold' : 'text-gray-500'
            }`}
            title="Max characters allowed to keep browser storage fast"
          >
            {content.length.toLocaleString()} / {MAX_NOTE_LENGTH.toLocaleString()}
          </span>

          {content && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 text-gray-400 hover:text-red-400 text-[11px] transition-colors ml-1"
              title="Clear notes"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      <textarea
        value={content}
        onChange={handleChange}
        maxLength={MAX_NOTE_LENGTH}
        placeholder="Write your approach, intuition, edge cases, or reminders..."
        rows={4}
        className="w-full bg-[#18191D] border border-[#292A2E] focus:border-[#383A40] rounded-md p-3 text-xs text-gray-200 placeholder-gray-500 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#383A40] transition-colors resize-y min-h-[90px] font-sans"
      />
    </div>
  );
}
