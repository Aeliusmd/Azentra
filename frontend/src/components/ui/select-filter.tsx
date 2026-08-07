import { ChevronDown } from "lucide-react";

export function SelectFilter({
  value,
  onChange,
  options,
  allLabel,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  /** Label for the "no filter" option, e.g. "All Towers". */
  allLabel: string;
  /** Accessible name — the control has no visible label. */
  label: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-md border border-hairline bg-white py-2.5 pr-9 pl-3.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}
