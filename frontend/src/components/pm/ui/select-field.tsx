"use client";

import { useCallback, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { FieldLabel } from "@/components/ui/field";
import { useAnchoredMenu } from "@/hooks/use-anchored-menu";
import { useDismiss } from "@/hooks/use-dismiss";

/**
 * Labelled dropdown for the modal forms.
 *
 * Deliberately not a native `<select>`: the browser renders that popup with OS
 * chrome — dark on macOS — which looks foreign inside the light dialogs.
 */
export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);
  const { triggerRef, style, place } = useAnchoredMenu<HTMLButtonElement>(open);

  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>

      <div ref={ref} className="relative">
        <button
          id={id}
          ref={triggerRef}
          type="button"
          onClick={() => {
            if (!open) place();
            setOpen((current) => !current);
          }}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`flex w-full items-center gap-2 rounded-md border bg-white py-3 pr-3 pl-3.5 text-left text-sm text-ink transition-colors focus-visible:ring-2 focus-visible:ring-brand/20 focus-visible:outline-none ${
            open
              ? "border-brand ring-2 ring-brand/20"
              : "border-hairline hover:bg-gray-50"
          }`}
        >
          <span className="min-w-0 flex-1 truncate">{value}</span>
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
            {options.map((option) => {
              const selected = option === value;
              return (
                <li key={option} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option);
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
                    <span className="truncate">{option}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
