"use client";

import type { LucideIcon } from "lucide-react";

export type ResTab = {
  id: string;
  label: string;
  /** Shown before the label where the tabs name places rather than filters. */
  icon?: LucideIcon;
  /** Omit where a total would not help. */
  count?: number;
};

/**
 * The resident portal's tab row.
 *
 * Where a tab carries a count, the resident can see there is nothing under
 * "Outstanding" without opening it — the question most of them came to ask,
 * answered before the click.
 */
export function ResTabBar({
  tabs,
  value,
  onChange,
  label,
  fill = false,
}: {
  tabs: ResTab[];
  value: string;
  onChange: (id: string) => void;
  /** Accessible name for the group. */
  label: string;
  /** Spread the tabs across the full width instead of sizing them to content. */
  fill?: boolean;
}) {
  return (
    // Narrow screens scroll the row rather than crushing the labels.
    <div className="overflow-x-auto">
      <div
        role="tablist"
        aria-label={label}
        className={`inline-flex gap-1 rounded-lg bg-gray-100 p-1 ${
          fill ? "min-w-full sm:w-full" : "min-w-full"
        }`}
      >
        {tabs.map((tab) => {
          const selected = tab.id === value;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-[14px] whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
                fill ? "sm:flex-1 sm:justify-center" : ""
              } ${
                selected
                  ? "bg-white font-semibold text-ink shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                  : "font-medium text-muted hover:text-ink"
              }`}
            >
              {Icon && <Icon aria-hidden="true" className="h-4 w-4" />}
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
