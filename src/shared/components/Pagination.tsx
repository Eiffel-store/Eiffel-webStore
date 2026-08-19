import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useLanguage } from '@/shared';

export interface PaginationProps {
  currentPage: number; // 1-indexed
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [12, 24, 48],
  className = ''
}) => {
  const { isRTL } = useLanguage();

  if (totalPages <= 1 && !totalItems) {
    return null;
  }

  // Calculate visible page range (e.g. 1 2 3 ... 10)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const startItem = totalItems !== undefined && pageSize !== undefined ? (currentPage - 1) * pageSize + 1 : undefined;
  const endItem = totalItems !== undefined && pageSize !== undefined ? Math.min(currentPage * pageSize, totalItems) : undefined;

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const FirstIcon = isRTL ? ChevronsRight : ChevronsLeft;
  const LastIcon = isRTL ? ChevronsLeft : ChevronsRight;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-surface-container dark:border-zinc-800/80 ${className}`}>
      {/* Items Counter */}
      {totalItems !== undefined && (
        <div className="text-xs font-mono text-secondary dark:text-zinc-400">
          {startItem && endItem ? (
            <span>
              {isRTL
                ? `عرض ${startItem} – ${endItem} من إجمالي ${totalItems} عنصر`
                : `Showing ${startItem} – ${endItem} of ${totalItems} items`}
            </span>
          ) : (
            <span>
              {isRTL ? `إجمالي ${totalItems} عنصر` : `Total ${totalItems} items`}
            </span>
          )}
        </div>
      )}

      {/* Page Navigation Controls */}
      <div className="flex items-center gap-1.5">
        {/* First Page Button */}
        {totalPages > 4 && (
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title={isRTL ? 'الصفحة الأولى' : 'First Page'}
          >
            <FirstIcon className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Previous Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
          title={isRTL ? 'السابق' : 'Previous'}
        >
          <PrevIcon className="w-3.5 h-3.5" />
          <span className="text-xs font-mono hidden md:inline">{isRTL ? 'السابق' : 'Prev'}</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="px-2 text-zinc-600 font-mono text-xs">
                  ...
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[32px] h-8 px-2 rounded font-mono text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="p-2 rounded border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
          title={isRTL ? 'التالي' : 'Next'}
        >
          <span className="text-xs font-mono hidden md:inline">{isRTL ? 'التالي' : 'Next'}</span>
          <NextIcon className="w-3.5 h-3.5" />
        </button>

        {/* Last Page Button */}
        {totalPages > 4 && (
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title={isRTL ? 'الصفحة الأخيرة' : 'Last Page'}
          >
            <LastIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Page Size Selector (Optional) */}
      {onPageSizeChange && pageSize && (
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span>{isRTL ? 'عرض في الصفحة:' : 'Per page:'}</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-zinc-900 border border-zinc-800 text-white rounded px-2 py-1 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
