"use client";

/** Compact segmented filter — one white chip inside a grey track. */
export function SegmentedFilter({
  label,
  options,
  value,
  onChange,
}: {
  /** Accessible name for the group. */
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1"
    >
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={selected}
            className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
              selected
                ? "bg-white font-semibold text-ink shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                : "text-muted hover:text-ink"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
