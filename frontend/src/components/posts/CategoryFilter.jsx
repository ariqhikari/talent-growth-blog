import React from 'react';

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
