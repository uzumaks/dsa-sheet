'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Tag, ChevronDown, Check } from 'lucide-react';

interface CustomTopicDropdownProps {
  availableTopics: string[];
  selectedTopic?: string;
  onSelectTopic: (topic: string) => void;
}

export function CustomTopicDropdown({
  availableTopics,
  selectedTopic = 'all',
  onSelectTopic,
}: CustomTopicDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isFiltered = selectedTopic !== 'all';
  const triggerLabel = isFiltered ? `Topic: ${selectedTopic}` : 'Topic: All';

  // Close on outside pointer click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left font-pretty" ref={containerRef}>
      {/* Compact Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-7.5 max-w-[145px] sm:max-w-[175px] px-2.5 rounded-md text-xs font-[300] flex items-center justify-between gap-1.5 border transition-all cursor-pointer select-none ${
          isFiltered
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-[#17181B] border-[#25272C] hover:border-[#383A40] text-gray-300'
        }`}
        title={triggerLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5 truncate">
          <Tag className={`w-3 h-3 shrink-0 stroke-[1.5] ${isFiltered ? 'text-emerald-400' : 'text-gray-500'}`} />
          <span className="truncate">{triggerLabel}</span>
        </div>
        <ChevronDown
          className={`w-3 h-3 text-gray-500 shrink-0 stroke-[1.5] transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Floating Dark Popover Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-56 sm:w-64 max-h-64 overflow-y-auto custom-scrollbar bg-[#17181B] border border-[#25272C] rounded-xl shadow-2xl p-1 text-xs select-none">
          {/* Option: All Topics */}
          <button
            type="button"
            onClick={() => {
              onSelectTopic('all');
              setIsOpen(false);
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors cursor-pointer ${
              selectedTopic === 'all'
                ? 'bg-[#25272C] text-emerald-400 font-[400]'
                : 'text-gray-300 hover:bg-[#25272C] hover:text-white font-[300]'
            }`}
          >
            <span>All Topics ({availableTopics.length})</span>
            {selectedTopic === 'all' && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2]" />}
          </button>

          <div className="my-1 border-t border-[#25272C]" />

          {/* List of Available Topics */}
          {availableTopics.map((topic) => {
            const isSelected = selectedTopic === topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  onSelectTopic(topic);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#25272C] text-emerald-400 font-[400]'
                    : 'text-gray-300 hover:bg-[#25272C] hover:text-white font-[300]'
                }`}
              >
                <span className="truncate mr-2">{topic}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
