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
    <div className="bg-[#111215] border-t border-[#202125] px-4 py-3.5 sm:px-6 sm:py-4 transition-all duration-200 font-pretty">
      <div className="flex items-center justify-between pb-2 text-xs text-gray-400">
        <span className="font-pretty-mono font-[300] tracking-widest text-emerald-400/90 uppercase text-[11px] sm:text-xs">
          Approach &amp; Intuition Notes
        </span>
        <div className="flex items-center gap-3">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1 text-amber-400/90 text-xs font-pretty-mono font-[300]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-pretty-mono font-[300]">
              <Check className="w-3.5 h-3.5 stroke-[2]" />
              Saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1 text-rose-400 text-xs font-pretty-mono font-[300]">
              <AlertTriangle className="w-3.5 h-3.5 stroke-[1.5]" />
              {errorMessage || 'Save error'}
            </span>
          )}
          {saveStatus === 'idle' && content && (
            <span className="text-gray-500 text-xs font-pretty-mono font-[300]">Autosaved</span>
          )}

          {/* Character counter */}
          <span
            className={`text-xs tabular-nums font-pretty-mono font-[300] ${
              isNearLimit ? 'text-amber-400 font-[400]' : 'text-gray-600'
            }`}
            title="Max characters allowed to keep browser storage fast"
          >
            {content.length.toLocaleString()} / {MAX_NOTE_LENGTH.toLocaleString()}
          </span>

          {content && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 text-gray-500 hover:text-rose-400 text-xs font-[300] transition-colors ml-1 cursor-pointer"
              title="Clear notes"
            >
              <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
              Clear
            </button>
          )}
        </div>
      </div>

      <textarea
        value={content}
        onChange={handleChange}
        maxLength={MAX_NOTE_LENGTH}
        placeholder="Write intuition summary, time/space complexity, edge cases, or key pointers..."
        rows={4}
        className="w-full bg-[#16171B] border border-[#25272C] focus:border-emerald-500/50 rounded-lg p-3.5 text-xs sm:text-sm font-[300] text-gray-200 placeholder-gray-500 leading-relaxed focus:outline-none transition-colors resize-y min-h-[100px] font-sans"
      />
    </div>
  );
}
