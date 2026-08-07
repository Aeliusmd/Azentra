/**
 * Mock data for Building Management — the single source of truth for towers,
 * floors and units. `dashboard-data.ts` re-exports `towers` from here so the
 * dashboard's tower table and this section can never drift apart.
 *
 * Replace each export with a `src/lib/api.ts` call once the backend lands.
 */

export type TowerTheme = "orange" | "teal" | "crimson" | "purple";

export type Tower = {
  slug: string;
  name: string;
  floors: number;
  totalUnits: number;
  occupied: number;
  vacant: number;
  /** totalUnits === occupied + vacant + maintenance. */
  maintenance: number;
  /** ISO date the tower was added. */
  createdAt: string;
  status: "active" | "under construction";
  amenities: string[];
  theme: TowerTheme;
};

export const towers: Tower[] = [
  {
    slug: "tower-a",
    name: "Tower A",
    floors: 12,
    totalUnits: 48,
    occupied: 42,
    vacant: 4,
    maintenance: 2,
    createdAt: "2022-08-15",
    status: "active",
    amenities: ["Elevator", "Parking", "Garden"],
    theme: "orange",
  },
  {
    slug: "tower-b",
    name: "Tower B",
    floors: 10,
    totalUnits: 40,
    occupied: 36,
    vacant: 3,
    maintenance: 1,
    createdAt: "2022-11-02",
    status: "active",
    amenities: ["Elevator", "Gym", "Pool"],
    theme: "teal",
  },
  {
    slug: "tower-c",
    name: "Tower C",
    floors: 15,
    totalUnits: 60,
    occupied: 55,
    vacant: 3,
    maintenance: 2,
    createdAt: "2023-03-20",
    status: "active",
    amenities: ["Elevator", "Gym", "Pool", "Parking"],
    theme: "crimson",
  },
  {
    slug: "tower-d",
    name: "Tower D",
    floors: 8,
    totalUnits: 32,
    occupied: 0,
    vacant: 32,
    maintenance: 0,
    createdAt: "2024-06-10",
    status: "under construction",
    amenities: ["Elevator", "Garden"],
    theme: "purple",
  },
];

export type Floor = {
  id: string;
  name: string;
  tower: string;
  totalUnits: number;
  occupied: number;
  vacant: number;
  /** Number of common areas on the floor; 0 renders as an em dash. */
  commonAreas: number;
  status: "active" | "under construction";
};

export const floors: Floor[] = [
  { id: "a-g", name: "Ground", tower: "Tower A", totalUnits: 4, occupied: 3, vacant: 1, commonAreas: 2, status: "active" },
  { id: "a-1", name: "1st Floor", tower: "Tower A", totalUnits: 4, occupied: 4, vacant: 0, commonAreas: 1, status: "active" },
  { id: "a-2", name: "2nd Floor", tower: "Tower A", totalUnits: 4, occupied: 4, vacant: 0, commonAreas: 0, status: "active" },
  { id: "a-3", name: "3rd Floor", tower: "Tower A", totalUnits: 4, occupied: 4, vacant: 0, commonAreas: 0, status: "active" },
  { id: "a-4", name: "4th Floor", tower: "Tower A", totalUnits: 4, occupied: 3, vacant: 1, commonAreas: 0, status: "active" },
  { id: "b-g", name: "Ground", tower: "Tower B", totalUnits: 4, occupied: 3, vacant: 1, commonAreas: 2, status: "active" },
  { id: "b-1", name: "1st Floor", tower: "Tower B", totalUnits: 4, occupied: 4, vacant: 0, commonAreas: 0, status: "active" },
  { id: "b-2", name: "2nd Floor", tower: "Tower B", totalUnits: 4, occupied: 4, vacant: 0, commonAreas: 0, status: "active" },
  { id: "b-3", name: "3rd Floor", tower: "Tower B", totalUnits: 4, occupied: 3, vacant: 1, commonAreas: 0, status: "active" },
  { id: "c-g", name: "Ground", tower: "Tower C", totalUnits: 4, occupied: 4, vacant: 0, commonAreas: 1, status: "active" },
  { id: "c-3", name: "3rd Floor", tower: "Tower C", totalUnits: 4, occupied: 3, vacant: 1, commonAreas: 0, status: "active" },
];

export type UnitStatus = "Occupied" | "Vacant" | "Maintenance";

export type Unit = {
  code: string;
  tower: string;
  floor: string;
  type: "1BHK" | "2BHK" | "3BHK";
  areaSqft: number;
  rent: number;
  status: UnitStatus;
};

export const units: Unit[] = [
  { code: "A-101", tower: "Tower A", floor: "Ground", type: "2BHK", areaSqft: 850, rent: 12000, status: "Occupied" },
  { code: "A-102", tower: "Tower A", floor: "Ground", type: "1BHK", areaSqft: 550, rent: 8000, status: "Vacant" },
  { code: "A-103", tower: "Tower A", floor: "Ground", type: "2BHK", areaSqft: 820, rent: 11500, status: "Occupied" },
  { code: "A-104", tower: "Tower A", floor: "Ground", type: "3BHK", areaSqft: 1200, rent: 18000, status: "Occupied" },
  { code: "A-201", tower: "Tower A", floor: "1st Floor", type: "2BHK", areaSqft: 850, rent: 12500, status: "Occupied" },
  { code: "A-202", tower: "Tower A", floor: "1st Floor", type: "1BHK", areaSqft: 550, rent: 8000, status: "Maintenance" },
  { code: "A-203", tower: "Tower A", floor: "1st Floor", type: "2BHK", areaSqft: 820, rent: 11500, status: "Occupied" },
  { code: "A-204", tower: "Tower A", floor: "1st Floor", type: "3BHK", areaSqft: 1200, rent: 18500, status: "Occupied" },
  { code: "B-101", tower: "Tower B", floor: "Ground", type: "2BHK", areaSqft: 880, rent: 13000, status: "Occupied" },
  { code: "B-102", tower: "Tower B", floor: "Ground", type: "1BHK", areaSqft: 580, rent: 8500, status: "Vacant" },
  { code: "B-103", tower: "Tower B", floor: "Ground", type: "3BHK", areaSqft: 1300, rent: 20000, status: "Occupied" },
  { code: "B-201", tower: "Tower B", floor: "1st Floor", type: "2BHK", areaSqft: 880, rent: 13000, status: "Occupied" },
  { code: "C-101", tower: "Tower C", floor: "Ground", type: "3BHK", areaSqft: 1350, rent: 22000, status: "Occupied" },
  { code: "C-102", tower: "Tower C", floor: "Ground", type: "2BHK", areaSqft: 900, rent: 14000, status: "Occupied" },
  { code: "C-201", tower: "Tower C", floor: "1st Floor", type: "3BHK", areaSqft: 1350, rent: 22000, status: "Maintenance" },
  { code: "C-202", tower: "Tower C", floor: "1st Floor", type: "2BHK", areaSqft: 900, rent: 14000, status: "Vacant" },
  { code: "C-301", tower: "Tower C", floor: "2nd Floor", type: "1BHK", areaSqft: 600, rent: 9000, status: "Occupied" },
  { code: "C-302", tower: "Tower C", floor: "2nd Floor", type: "2BHK", areaSqft: 900, rent: 14000, status: "Occupied" },
];

/** Distinct tower names, for the "All Towers" filters. */
export const towerNames = towers.map((tower) => tower.name);

export const buildingSummary = {
  towers: towers.length,
  floors: floors.length,
  units: units.length,
  // Stated figure from the design — the seeded rows above are a partial sample
  // of each tower, so this is not derivable from them.
  occupancyRate: 82,
};

export function formatRent(rent: number) {
  return `₹${rent.toLocaleString("en-IN")}`;
}
