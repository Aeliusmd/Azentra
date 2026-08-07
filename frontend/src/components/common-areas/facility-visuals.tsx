import Image from "next/image";

import type { FacilityCategory } from "@/lib/common-areas-data";

export const CATEGORY_CHIP: Record<FacilityCategory, string> = {
  Recreation: "bg-indigo-50 text-indigo-700",
  Fitness: "bg-sky-50 text-sky-700",
  Event: "bg-amber-50 text-amber-700",
  Sports: "bg-emerald-50 text-emerald-700",
  Parking: "bg-purple-50 text-purple-700",
  Study: "bg-teal-50 text-teal-700",
};

export function CategoryChip({ category }: { category: FacilityCategory }) {
  return (
    <span
      className={`rounded px-2 py-1 text-[11px] font-medium ${CATEGORY_CHIP[category]}`}
    >
      {category}
    </span>
  );
}

export function StatusPill({
  status,
  className = "",
}: {
  status: "active" | "inactive";
  className?: string;
}) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-[11px] font-medium ${
        status === "active"
          ? "bg-green-100 text-green-700"
          : "bg-white/90 text-gray-600"
      } ${className}`}
    >
      {status}
    </span>
  );
}

/**
 * Facility photo. Images picked in the browser arrive as data URLs, which the
 * image optimizer can't fetch — those bypass it.
 */
export function FacilityImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized={src.startsWith("data:")}
      sizes="(max-width: 768px) 100vw, 400px"
      className="object-cover"
    />
  );
}
