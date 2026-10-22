'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, ChevronDown, Check } from 'lucide-react';
import { SortOption } from '@/lib/types';

interface CustomSortDropdownProps {
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
}

const sortOptionsList: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Sort: Default' },
  { value: 'name-asc', label: 'Name: A → Z' },
  { value: 'name-desc', label: 'Name: Z → A' },
  { value: 'difficulty-asc', label: 'Easy → Hard' },
  { value: 'difficulty-desc', label: 'Hard → Easy' },
  { value: 'incomplete-first', label: 'Todo first' },
  { value: 'completed-first', label: 'Done first' },
];

export function CustomSortDropdown({ sort, onSortChange }: CustomSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLabel =
    sortOptionsList.find((opt) => opt.value === sort)?.label || 'Sort: Default';

  // Close on outside click
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
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-7.5 px-2.5 rounded-md text-xs font-medium flex items-center justify-between gap-1.5 bg-[#17181B] border border-[#292A2E] hover:border-[#3E4148] text-gray-300 transition-all cursor-pointer select-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <ArrowUpDown className="w-3 h-3 text-gray-500 shrink-0" />
        <span className="truncate">{currentLabel}</span>
        <ChevronDown
          className={`w-3 h-3 text-gray-400 shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-44 bg-[#17181B] border border-[#292A2E] rounded-md shadow-2xl p-1 text-xs select-none">
          {sortOptionsList.map((opt) => {
            const isSelected = sort === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onSortChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#25272D] text-emerald-400 font-medium'
                    : 'text-gray-300 hover:bg-[#25272D] hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
