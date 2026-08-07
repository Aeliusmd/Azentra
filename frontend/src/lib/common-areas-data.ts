/**
 * Mock data for Common Area Management.
 *
 * Only Swimming Pool's description and maintenance dates come from the design;
 * the rest are placeholders. Replace with `src/lib/api.ts` calls when the
 * backend lands.
 */

export const FACILITY_CATEGORIES = [
  "Recreation",
  "Fitness",
  "Event",
  "Sports",
  "Parking",
  "Study",
] as const;

export type FacilityCategory = (typeof FACILITY_CATEGORIES)[number];

export type Facility = {
  id: string;
  name: string;
  category: FacilityCategory;
  location: string;
  capacity: number;
  hours: string;
  bookingRequired: boolean;
  status: "active" | "inactive";
  /** Path under `public/`, or a data URL for an image added in-session. */
  image: string;
  lastMaintained: string;
  nextMaintenance: string;
  description: string;
};

export const facilities: Facility[] = [
  {
    id: "swimming-pool",
    name: "Swimming Pool",
    category: "Recreation",
    location: "Ground Floor, Tower B",
    capacity: 50,
    hours: "6:00 AM - 9:00 PM",
    bookingRequired: true,
    status: "active",
    image: "/swimpool.png",
    lastMaintained: "2026-07-01",
    nextMaintenance: "2026-08-01",
    description: "Olympic size swimming pool with heated water",
  },
  {
    id: "gymnasium",
    name: "Gymnasium",
    category: "Fitness",
    location: "1st Floor, Tower A",
    capacity: 30,
    hours: "5:00 AM - 11:00 PM",
    bookingRequired: false,
    status: "active",
    image: "/gym.png",
    lastMaintained: "2026-06-20",
    nextMaintenance: "2026-09-20",
    description: "Fully equipped gym with cardio and weight training areas",
  },
  {
    id: "community-hall",
    name: "Community Hall",
    category: "Event",
    location: "Ground Floor, Tower C",
    capacity: 200,
    hours: "8:00 AM - 10:00 PM",
    bookingRequired: true,
    status: "active",
    image: "/community hall.png",
    lastMaintained: "2026-06-10",
    nextMaintenance: "2026-09-10",
    description: "Banquet hall for weddings, meetings and community events",
  },
  {
    id: "children-play-area",
    name: "Children Play Area",
    category: "Recreation",
    location: "Garden Area, Tower A",
    capacity: 25,
    hours: "6:00 AM - 8:00 PM",
    bookingRequired: false,
    status: "active",
    image: "/children play area.png",
    lastMaintained: "2026-07-05",
    nextMaintenance: "2026-08-05",
    description: "Outdoor playground with swings, slides and soft flooring",
  },
  {
    id: "tennis-court",
    name: "Tennis Court",
    category: "Sports",
    location: "Outdoor, Tower B",
    capacity: 8,
    hours: "6:00 AM - 9:00 PM",
    bookingRequired: true,
    status: "active",
    image: "/tennis court.png",
    lastMaintained: "2026-06-28",
    nextMaintenance: "2026-08-28",
    description: "Floodlit hard court available for singles and doubles",
  },
  {
    id: "parking-lot-a",
    name: "Parking Lot A",
    category: "Parking",
    location: "Underground, Tower A",
    capacity: 80,
    hours: "24 Hours",
    bookingRequired: true,
    status: "active",
    image: "/Parking lot a.png",
    lastMaintained: "2026-05-15",
    nextMaintenance: "2026-11-15",
    description: "Covered resident parking with 24/7 CCTV monitoring",
  },
  {
    id: "library",
    name: "Library",
    category: "Study",
    location: "2nd Floor, Tower C",
    capacity: 40,
    hours: "8:00 AM - 9:00 PM",
    bookingRequired: false,
    status: "inactive",
    image: "/Library.png",
    lastMaintained: "2026-04-02",
    nextMaintenance: "2026-10-02",
    description: "Quiet reading room and study space with free Wi-Fi",
  },
  {
    id: "jogging-track",
    name: "Jogging Track",
    category: "Fitness",
    location: "Perimeter, All Towers",
    capacity: 30,
    hours: "5:00 AM - 9:00 PM",
    bookingRequired: false,
    status: "active",
    image: "/Joggin.png",
    lastMaintained: "2026-07-08",
    nextMaintenance: "2026-10-08",
    description: "800m landscaped track circling the property perimeter",
  },
];
