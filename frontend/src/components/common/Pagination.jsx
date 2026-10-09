import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  hasNext = false,
  hasPrev = false,
  totalItems = 0,
}) {
  if (totalPages <= 1) return null;

  // Generate page numbers to display (windowed)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-paper-300">
      <p className="text-xs text-ink-600 font-medium order-2 sm:order-1">
        Showing page <span className="text-ink-900 font-semibold">{currentPage}</span> of{' '}
        <span className="text-ink-900 font-semibold">{totalPages}</span> ({totalItems} total)
      </p>

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasPrev || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Prev</span>
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-md text-xs font-semibold transition-all select-none ${
                page === currentPage
                  ? 'bg-ink-900 text-white shadow-tactile-sm'
                  : 'text-ink-700 hover:bg-paper-200 hover:text-ink-950 border border-transparent'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          disabled={!hasNext || currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

