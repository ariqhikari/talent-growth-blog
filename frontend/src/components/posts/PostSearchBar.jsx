import React from 'react';
import { Search, X } from 'lucide-react';

export function PostSearchBar({ value, onChange, onClear, placeholder = 'Search stories by title or content...' }) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-paper-50 border border-paper-300 rounded-lg text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-tactile-sm"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-400 hover:text-ink-700 transition-colors"
          aria-label="Clear search input"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none py-1">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onSelectCategory(cat.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none ${
              isSelected
                ? 'bg-ink-900 text-white shadow-tactile-sm'
                : 'bg-paper-50 text-ink-700 border border-paper-300 hover:bg-paper-200 hover:text-ink-950'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

