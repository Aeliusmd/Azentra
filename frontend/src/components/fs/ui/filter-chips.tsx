"use client";

/**
 * Compact chip row — "All" plus one chip per value. Smaller than the Property
 * Manager's row because the supervisor's lists carry two of them side by side.
 */

const ACTIVE = {
  green: "bg-brand text-white",
  amber: "bg-[#e8a33d] text-white",
} as const;

export function FsFilterChips({
  options,
  value,
  onChange,
  label,
  tone = "green",
}: {
  /** Chip labels in display order; the first is the "no filter" option. */
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the group. */
  label: string;
  tone?: keyof typeof ACTIVE;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap items-center gap-2"
    >
      {options.map((option) => {
        const selected = option === value;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={selected}
            className={`rounded-lg px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
              selected
                ? ACTIVE[tone]
                : "border border-hairline bg-white text-ink hover:bg-gray-50"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
