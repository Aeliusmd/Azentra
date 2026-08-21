import Image from "next/image";

import type { Facility } from "@/lib/res/facilities-data";

/**
 * The facility photograph.
 *
 * The files live under `public/` and are shared with the property's common-area
 * register, so the resident sees the same room the office manages. They are
 * 366x128 banners, which is the aspect the card reserves — nothing is cropped
 * and nothing is letterboxed.
 *
 * Where the property has not supplied a photo, each facility falls back to its
 * own wash of colour behind its own icon: a broken `<img>` or a grey box reads
 * worse than something deliberate, and the colour still makes the grid
 * scannable by shape.
 */
export function FacilityImage({
  facility,
  size = "card",
  priority = false,
}: {
  facility: Facility;
  /** `card` fills the top of a tile; `thumb` is the square in a dialog. */
  size?: "card" | "thumb";
  /** Set on the first row, which is above the fold and paints last without it. */
  priority?: boolean;
}) {
  const Icon = facility.icon;

  if (size === "thumb") {
    if (facility.image) {
      return (
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={facility.image}
            alt=""
            fill
            sizes="56px"
            className="object-cover"
          />
        </span>
      );
    }

    return (
      <span
        aria-hidden="true"
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${facility.gradient}`}
      >
        <Icon className="h-6 w-6 text-white/90" />
      </span>
    );
  }

  if (facility.image) {
    return (
      <div className="relative aspect-[366/128] w-full">
        <Image
          src={facility.image}
          alt={facility.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`flex aspect-[366/128] items-center justify-center bg-gradient-to-br ${facility.gradient}`}
    >
      <Icon className="h-10 w-10 text-white/80" />
    </div>
  );
}
