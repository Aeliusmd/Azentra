"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const BUTTON =
  "flex h-8 min-w-8 items-center justify-center rounded-md border border-hairline px-2 text-[13px] transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-gray-300";

/** Footer pager for the supervisor's long lists. */
export function FsPagination({
  page,
  pageCount,
  total,
  pageSize,
  onChange,
  noun = "records",
}: {
  /** 1-based. */
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  noun?: string;
}) {
  if (total === 0) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline px-5 py-3.5">
      <p className="text-[13px] text-muted">
        Showing {first}–{last} of {total} {noun}
      </p>

      {pageCount > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
            className={`${BUTTON} text-gray-500 hover:bg-gray-50 hover:text-ink`}
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </button>

          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (number) => (
              <button
                key={number}
                type="button"
                onClick={() => onChange(number)}
                aria-current={number === page ? "page" : undefined}
                className={`${BUTTON} ${
                  number === page
                    ? "border-brand bg-brand font-semibold text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-ink"
                }`}
              >
                {number}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onChange(page + 1)}
            disabled={page === pageCount}
            aria-label="Next page"
            className={`${BUTTON} text-gray-500 hover:bg-gray-50 hover:text-ink`}
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
