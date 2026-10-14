'use client';

import React, { useState, useEffect } from 'react';
import { Problem, Topic, Difficulty } from '@/lib/types';
import { X, Trash2 } from 'lucide-react';

interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: Topic[];
  selectedTopicId: string;
  problemToEdit?: Problem | null;
  onSave: (data: {
    id?: string;
    title: string;
    url?: string;
    topicId: string;
    difficulty: Difficulty;
  }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function ProblemModal({
  isOpen,
  onClose,
  topics,
  selectedTopicId,
  problemToEdit,
  onSave,
  onDelete,
}: ProblemModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [topicId, setTopicId] = useState(selectedTopicId);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (problemToEdit) {
      setTitle(problemToEdit.title);
      setUrl(problemToEdit.url || '');
      setTopicId(problemToEdit.topicId);
      setDifficulty(problemToEdit.difficulty);
    } else {
      setTitle('');
      setUrl('');
      setTopicId(selectedTopicId || (topics[0]?.id ?? ''));
      setDifficulty('medium');
    }
    setConfirmDelete(false);
  }, [problemToEdit, selectedTopicId, topics, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !topicId) return;

    try {
      setIsSubmitting(true);
      await onSave({
        id: problemToEdit?.id,
        title: title.trim(),
        url: url.trim() || undefined,
        topicId,
        difficulty,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!problemToEdit || !onDelete) return;
    try {
      setIsSubmitting(true);
      await onDelete(problemToEdit.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#17181B] border border-[#292A2E] rounded-lg shadow-2xl p-5 text-gray-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#292A2E]">
          <h2 className="text-sm font-semibold text-gray-100">
            {problemToEdit ? 'Edit Problem' : 'Add New Problem'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Problem Title */}
          <div>
            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
              Problem Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Trapping Rain Water"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#101113] border border-[#292A2E] focus:border-[#3E4148] rounded px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Problem URL */}
          <div>
            <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
              Problem URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://leetcode.com/problems/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[#101113] border border-[#292A2E] focus:border-[#3E4148] rounded px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Topic & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                Topic <span className="text-red-400">*</span>
              </label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full bg-[#101113] border border-[#292A2E] focus:border-[#3E4148] rounded px-2.5 py-2 text-xs text-gray-200 focus:outline-none cursor-pointer"
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full bg-[#101113] border border-[#292A2E] focus:border-[#3E4148] rounded px-2.5 py-2 text-xs text-gray-200 focus:outline-none cursor-pointer"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Delete Option if editing */}
          {problemToEdit && (
            <div className="pt-2 border-t border-[#232428] flex items-center justify-between">
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-red-400 text-[11px]">Confirm delete?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-2 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded text-[11px] font-medium"
                  >
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="text-gray-400 hover:text-gray-200 text-[11px]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-[11px] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete problem</span>
                </button>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#292A2E]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-gray-400 hover:text-gray-200 hover:bg-[#202125] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium transition-colors"
            >
              {problemToEdit ? 'Save Changes' : 'Add Problem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
