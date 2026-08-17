"use client";

import { useCallback, useState } from "react";
import { Building2, CalendarDays, Check, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useAnchoredMenu } from "@/hooks/use-anchored-menu";
import { useDismiss } from "@/hooks/use-dismiss";
import {
  billingPeriods,
  selectAccPeriod,
  useSelectedAccPeriod,
} from "@/lib/acc/periods";
import {
  assignedProperties,
  selectAccProperty,
  useSelectedAccProperty,
} from "@/lib/acc/properties";

/**
 * The pair of header controls that scope every financial page: whose books, and
 * which month.
 *
 * Built as a button + listbox rather than a native `<select>` for the same
 * reason the Property Manager's filters are — the OS popup renders in system
 * chrome, which reads as a foreign element inside the light dashboard.
 */
function ScopeMenu({
  icon: Icon,
  value,
  options,
  onChange,
  label,
  className,
}: {
  icon: LucideIcon;
  /** The id currently chosen. */
  value: string;
  options: { id: string; label: string }[];
  onChange: (id: string) => void;
  /** Accessible name — the control has no visible label. */
  label: string;
  className: string;
}) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);
  const { triggerRef, style, place } = useAnchoredMenu<HTMLButtonElement>(open);

  const current = options.find((option) => option.id === value);

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
        aria-label={`${label}: ${current?.label ?? "—"}`}
        className={`flex w-full items-center gap-2 rounded-lg border bg-white py-2.5 pr-3 pl-3.5 text-left text-sm text-ink transition-colors focus-visible:ring-2 focus-visible:ring-brand/20 focus-visible:outline-none ${
          open
            ? "border-brand ring-2 ring-brand/20"
            : "border-hairline hover:bg-gray-50"
        }`}
      >
        <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-gray-400" />
        <span className="min-w-0 flex-1 truncate">{current?.label ?? "—"}</span>
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
            const selected = option.id === value;

            return (
              <li key={option.id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.id);
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
                  <span className="truncate">{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Switches which of the accountant's authorised properties is in view. */
export function AccPropertySelector({
  className = "w-full sm:w-[196px]",
}: {
  className?: string;
}) {
  const selected = useSelectedAccProperty();

  return (
    <ScopeMenu
      icon={Building2}
      label="Selected property"
      value={selected}
      onChange={selectAccProperty}
      options={assignedProperties.map((property) => ({
        id: property.id,
        label: property.name,
      }))}
      className={className}
    />
  );
}

/** Switches the billing period every figure on the page is drawn from. */
export function AccPeriodSelector({
  className = "w-full sm:w-[160px]",
}: {
  className?: string;
}) {
  const selected = useSelectedAccPeriod();

  return (
    <ScopeMenu
      icon={CalendarDays}
      label="Billing period"
      value={selected}
      onChange={selectAccPeriod}
      options={billingPeriods.map((period) => ({
        id: period.id,
        label: period.label,
      }))}
      className={className}
    />
  );
}
