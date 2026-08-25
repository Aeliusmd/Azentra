import {
  Building2,
  Droplet,
  Dumbbell,
  Flame,
  Presentation,
  type LucideIcon,
} from "lucide-react";

import { timeRangeShort } from "@/lib/res/format";

/**
 * The common-area facilities a resident may book.
 *
 * Opening hours are stored once and spliced into the description, so the
 * sentence on the card and the window the booking form enforces are the same
 * fact — a card cannot advertise 6 AM while the form refuses it.
 */

export type Facility = {
  id: string;
  name: string;
  /** `{hours}` is replaced with the opening hours. */
  description: string;
  icon: LucideIcon;
  /**
   * Photograph under `public/`, shared with the property's common-area
   * register so both portals show the same room. Omitted where the property
   * has not supplied one, and the gradient stands in.
   */
  image?: string;
  /** Wash of colour behind the icon when there is no photograph. */
  gradient: string;
  location: string;
  capacity: number;
  /** 24-hour `HH:MM` bounds a booking has to sit inside. */
  opens: string;
  closes: string;
  /** House rules shown on the booking form. */
  rules: string;
};

export const facilities: Facility[] = [
  {
    id: "swimming-pool",
    name: "Swimming Pool",
    description: "25m lap pool with heated jacuzzi, open {hours} daily",
    icon: Droplet,
    image: "/swimpool.png",
    gradient: "from-sky-400 to-cyan-600",
    location: "Ground Floor, Tower A Wing",
    capacity: 30,
    opens: "06:00",
    closes: "21:00",
    rules: "Children under 12 must be accompanied. No glassware poolside.",
  },
  {
    id: "gymnasium",
    name: "Gymnasium",
    description:
      "Fully equipped fitness center with cardio and weight training area, open {hours}",
    icon: Dumbbell,
    image: "/gym.png",
    gradient: "from-slate-500 to-slate-700",
    location: "Ground Floor, Tower B Wing",
    capacity: 20,
    opens: "05:00",
    closes: "23:00",
    rules: "Wipe down equipment after use. Indoor shoes only.",
  },
  {
    id: "banquet-hall",
    name: "Banquet Hall",
    description:
      "Elegant event space for private parties, seats up to 80 guests with catering kitchen",
    icon: Building2,
    image: "/community hall.png",
    gradient: "from-amber-400 to-amber-700",
    location: "1st Floor, Main Building",
    capacity: 80,
    opens: "09:00",
    closes: "23:00",
    rules: "Bookings over 40 guests need management approval. Music off by 11 PM.",
  },
  {
    id: "meeting-room",
    name: "Meeting Room",
    description:
      "Professional meeting space with projector and video conferencing, seats 12",
    icon: Presentation,
    image: "/Library.png",
    gradient: "from-emerald-400 to-teal-600",
    location: "1st Floor, Main Building",
    capacity: 12,
    opens: "08:00",
    closes: "20:00",
    rules: "Two-hour slots. Leave the room as you found it.",
  },
  {
    id: "bbq-terrace",
    name: "BBQ Terrace",
    description:
      "Outdoor BBQ area with grills, seating for 20, perfect for weekend gatherings",
    icon: Flame,
    image: "/BBQ.png",
    gradient: "from-orange-400 to-rose-600",
    location: "Rooftop, Tower B",
    capacity: 20,
    opens: "10:00",
    closes: "22:00",
    rules: "Grills must be cleaned after use. No open flames after 10 PM.",
  },
];

/** The description with the opening hours filled in. */
export function facilityBlurb(facility: Facility) {
  return facility.description.replace(
    "{hours}",
    timeRangeShort(facility.opens, facility.closes),
  );
}

export function facilityByName(name: string) {
  return facilities.find((facility) => facility.name === name) ?? null;
}

export function facilityById(id: string) {
  return facilities.find((facility) => facility.id === id) ?? null;
}
