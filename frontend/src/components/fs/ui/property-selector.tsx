"use client";

import { ChevronDown } from "lucide-react";

import {
  selectFsProperty,
  supervisedProperties,
  useSelectedFsProperty,
} from "@/lib/fs/properties";

/** Switches which supervised property the page is showing. */
export function FsPropertySelector({ className = "" }: { className?: string }) {
  const selected = useSelectedFsProperty();

  return (
    <div className={`relative ${className}`}>
      <select
        aria-label="Selected property"
        value={selected}
        onChange={(event) => selectFsProperty(event.target.value)}
        className="w-full appearance-none rounded-md border border-hairline bg-white py-2.5 pr-9 pl-3.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
      >
        {supervisedProperties.map((property) => (
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
  );
}
