"use client";

import { Building2, ChevronDown } from "lucide-react";

import { guardedProperties } from "@/lib/so/properties-data";
import { selectSoProperty, useSelectedSoProperty } from "@/lib/so/properties";

/** Switches which guarded property the page is watching. */
export function SoPropertySelector({ className = "" }: { className?: string }) {
  const selected = useSelectedSoProperty();

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Building2
        aria-hidden="true"
        className="h-[18px] w-[18px] text-gray-400"
      />

      <div className="relative min-w-0 flex-1">
        <select
          aria-label="Selected property"
          value={selected}
          onChange={(event) => selectSoProperty(event.target.value)}
          className="w-full appearance-none rounded-lg border border-hairline bg-white py-2.5 pr-9 pl-3.5 text-[14px] text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          {guardedProperties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.name}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
}
