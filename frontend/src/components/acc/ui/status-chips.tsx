"use client";

/**
 * Pill filter row across the top of the accountant's lists — "All" plus one
 * chip per status.
 *
 * Rounded-full and navy-on-select, unlike the Field Supervisor's square green
 * chips: these sit on the page background next to the search box rather than
 * inside a filter card, so they need to read as controls on their own.
 */
export function AccStatusChips({
  options,
  value,
  onChange,
  label,
}: {
  /** Chip labels in display order; the first is the "no filter" option. */
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the group. */
  label: string;
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
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
              selected
                ? "bg-[#1b3a5c] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200/70 hover:text-ink"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
