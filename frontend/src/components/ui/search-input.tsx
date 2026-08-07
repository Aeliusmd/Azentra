import { Search } from "lucide-react";

export function SearchInput({
  value,
  onChange,
  placeholder,
  label,
  className = "w-full sm:max-w-[370px]",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Accessible name — the control has no visible label. */
  label: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400"
      />
      <input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-hairline bg-white py-2.5 pr-3.5 pl-10 text-sm text-ink placeholder:text-gray-400 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}
