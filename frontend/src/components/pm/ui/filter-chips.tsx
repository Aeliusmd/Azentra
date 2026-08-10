"use client";

/** Segmented filter row — "All" plus one chip per status. */
const ACTIVE = {
  green: "bg-brand text-white",
  slate: "bg-[#5b7080] text-white",
} as const;

export function FilterChips({
  options,
  value,
  onChange,
  label,
  trailing,
  tone = "green",
}: {
  /** Chip labels in display order; the first is the "no filter" option. */
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the group. */
  label: string;
  /** Right-aligned caption, e.g. "8 work orders". */
  trailing?: React.ReactNode;
  /** Fill of the selected chip. */
  tone?: keyof typeof ACTIVE;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div
        role="group"
        aria-label={label}
        className="flex flex-wrap items-center gap-2.5"
      >
        {options.map((option) => {
          const selected = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={selected}
              className={`rounded-lg px-4 py-2 text-[15px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none ${
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

      {trailing && (
        <p className="text-[15px] text-gray-400">{trailing}</p>
      )}
    </div>
  );
}
