'use client';

import React from 'react';

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  className?: string;
};

function range(start: number, end: number) {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

export const Pagination: React.FC<Props> = ({
  page,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  const siblings = 1; // pages to show on each side
  const pages: (number | '...')[] = [];

  const left = Math.max(1, page - siblings);
  const right = Math.min(totalPages, page + siblings);

  if (left > 1) {
    pages.push(1);
    if (left > 2) pages.push('...');
  }

  pages.push(...range(left, right));

  if (right < totalPages) {
    if (right < totalPages - 1) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav className={`flex justify-center ${className || ''}`} aria-label="Pagination">
      <ul className="inline-flex items-center space-x-2">
        <li>
          <button
            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="前のページ"
          >
            前へ
          </button>
        </li>

        {pages.map((p, idx) => (
          <li key={String(p) + idx}>
            {p === '...' ? (
              <span className="px-3 py-1">…</span>
            ) : (
              <button
                className={`px-3 py-1 rounded border ${
                  p === page ? 'bg-gray-200' : 'bg-white'
                }`}
                onClick={() => onPageChange(p as number)}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            )}
          </li>
        ))}

        <li>
          <button
            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="次のページ"
          >
            次へ
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
