"use client";

/**
 * The resident portal's tab row.
 *
 * Each tab carries its own count, so the resident can see there is nothing
 * under "Outstanding" without having to open it — the question most of them
 * came to ask, answered before the click.
 */
export function ResTabBar({
  tabs,
  value,
  onChange,
  label,
}: {
  /** `count` is optional — omit it where a total would not help. */
  tabs: { id: string; label: string; count?: number }[];
  value: string;
  onChange: (id: string) => void;
  /** Accessible name for the group. */
  label: string;
}) {
  return (
    <div className="overflow-x-auto">
      <div
        role="tablist"
        aria-label={label}
        className="inline-flex min-w-full gap-1 rounded-lg bg-gray-100 p-1"
      >
        {tabs.map((tab) => {
          const selected = tab.id === value;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-[14px] whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                selected
                  ? "bg-white font-semibold text-ink shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                  : "font-medium text-muted hover:text-ink"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
              <span
                className={`inline-flex min-w-[22px] items-center justify-center rounded-full px-1.5 py-0.5 text-[12px] font-medium ${
                  selected
                    ? "bg-[#eef3f9] text-[#2e6cad]"
                    : "bg-gray-200/70 text-gray-500"
                }`}
              >
                {tab.count}
              </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
