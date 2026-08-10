"use client";

import { useCallback, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { useAnchoredMenu } from "@/hooks/use-anchored-menu";
import { useDismiss } from "@/hooks/use-dismiss";

/**
 * Filter dropdown.
 *
 * A native `<select>` renders its popup with the OS chrome — dark on macOS —
 * which reads as a foreign element inside the light dashboard. This is a
 * button + listbox so the open menu matches the rest of the UI.
 */
export function FilterSelect({
  value,
  onChange,
  options,
  allLabel = "All",
  label,
  className = "",
}: {
  /** Empty string means "no filter". */
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  /** Label for the "no filter" entry. */
  allLabel?: string;
  /** Accessible name — the control has no visible label. */
  label: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);
  const { triggerRef, style, place } = useAnchoredMenu<HTMLButtonElement>(open);

  const entries = [
    { value: "", text: allLabel },
    ...options.map((option) => ({ value: option, text: option })),
  ];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (!open) place();
          setOpen((current) => !current);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${value || allLabel}`}
        className={`flex w-full items-center gap-2 rounded-md border bg-white py-2.5 pr-3 pl-3.5 text-left text-sm text-ink transition-colors focus-visible:ring-2 focus-visible:ring-brand/20 focus-visible:outline-none ${
          open
            ? "border-brand ring-2 ring-brand/20"
            : "border-hairline hover:bg-gray-50"
        }`}
      >
        <span className="min-w-0 flex-1 truncate">{value || allLabel}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && style && (
        <ul
          role="listbox"
          aria-label={label}
          style={style}
          className="z-50 overflow-y-auto rounded-lg border border-hairline bg-white py-1 shadow-lg"
        >
          {entries.map((entry) => {
            const selected = entry.value === value;
            return (
              <li
                key={entry.value || "__all"}
                role="option"
                aria-selected={selected}
              >
                <button
                  type="button"
                  onClick={() => {
                    onChange(entry.value);
                    close();
                  }}
                  className={`flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${
                    selected ? "font-semibold text-ink" : "text-gray-600"
                  }`}
                >
                  <Check
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 ${
                      selected ? "text-brand" : "text-transparent"
                    }`}
                  />
                  <span className="truncate">{entry.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
