import type { PillTone } from "@/components/pm/ui/pill";

/** Mock unit inventory. Swap for a `src/lib/api.ts` call when the backend lands. */

export const UNIT_STATUSES = ["occupied", "vacant", "maintenance"] as const;
export type UnitStatus = (typeof UNIT_STATUSES)[number];

export const UNIT_STATUS_TONE: Record<UnitStatus, PillTone> = {
  occupied: "green",
  vacant: "green",
  maintenance: "amber",
};

export const UNIT_TOWERS = ["Tower A", "Tower B", "Tower C"] as const;

export type Unit = {
  id: string;
  tower: string;
  floor: string;
  type: string;
  bedrooms: number;
  area: number;
  rent: number;
  status: UnitStatus;
  /** Empty when the unit is vacant or under maintenance. */
  tenant: string;
};

export const units: Unit[] = [
  {
    id: "A-101",
    tower: "Tower A",
    floor: "Ground",
    type: "2BHK",
    bedrooms: 2,
    area: 850,
    rent: 12000,
    status: "occupied",
    tenant: "John Smith",
  },
  {
    id: "A-102",
    tower: "Tower A",
    floor: "Ground",
    type: "1BHK",
    bedrooms: 1,
    area: 550,
    rent: 8000,
    status: "vacant",
    tenant: "",
  },
  {
    id: "A-103",
    tower: "Tower A",
    floor: "Ground",
    type: "2BHK",
    bedrooms: 2,
    area: 820,
    rent: 11500,
    status: "occupied",
    tenant: "Sarah Johnson",
  },
  {
    id: "A-104",
    tower: "Tower A",
    floor: "Ground",
    type: "3BHK",
    bedrooms: 3,
    area: 1200,
    rent: 18000,
    status: "occupied",
    tenant: "Michael Brown",
  },
  {
    id: "A-201",
    tower: "Tower A",
    floor: "Floor 2",
    type: "2BHK",
    bedrooms: 2,
    area: 850,
    rent: 12500,
    status: "occupied",
    tenant: "Emily Davis",
  },
  {
    id: "A-202",
    tower: "Tower A",
    floor: "Floor 2",
    type: "1BHK",
    bedrooms: 1,
    area: 550,
    rent: 8000,
    status: "maintenance",
    tenant: "",
  },
  {
    id: "A-203",
    tower: "Tower A",
    floor: "Floor 2",
    type: "2BHK",
    bedrooms: 2,
    area: 820,
    rent: 11500,
    status: "occupied",
    tenant: "David Wilson",
  },
  {
    id: "A-204",
    tower: "Tower A",
    floor: "Floor 2",
    type: "3BHK",
    bedrooms: 3,
    area: 1200,
    rent: 18500,
    status: "occupied",
    tenant: "Jessica Lee",
  },
  {
    id: "B-101",
    tower: "Tower B",
    floor: "Ground",
    type: "2BHK",
    bedrooms: 2,
    area: 880,
    rent: 13000,
    status: "occupied",
    tenant: "Robert Taylor",
  },
  {
    id: "B-102",
    tower: "Tower B",
    floor: "Ground",
    type: "1BHK",
    bedrooms: 1,
    area: 580,
    rent: 8500,
    status: "vacant",
    tenant: "",
  },
  {
    id: "B-103",
    tower: "Tower B",
    floor: "Ground",
    type: "3BHK",
    bedrooms: 3,
    area: 1300,
    rent: 20000,
    status: "occupied",
    tenant: "Amanda Clark",
  },
  {
    id: "B-201",
    tower: "Tower B",
    floor: "Floor 2",
    type: "2BHK",
    bedrooms: 2,
    area: 880,
    rent: 13000,
    status: "occupied",
    tenant: "James Wilson",
  },
  {
    id: "C-101",
    tower: "Tower C",
    floor: "Ground",
    type: "3BHK",
    bedrooms: 3,
    area: 1350,
    rent: 22000,
    status: "occupied",
    tenant: "Laura Martinez",
  },
  {
    id: "C-102",
    tower: "Tower C",
    floor: "Ground",
    type: "2BHK",
    bedrooms: 2,
    area: 900,
    rent: 14000,
    status: "occupied",
    tenant: "Kevin Anderson",
  },
  {
    id: "C-201",
    tower: "Tower C",
    floor: "Floor 2",
    type: "3BHK",
    bedrooms: 3,
    area: 1350,
    rent: 22000,
    status: "maintenance",
    tenant: "",
  },
  {
    id: "C-202",
    tower: "Tower C",
    floor: "Floor 2",
    type: "2BHK",
    bedrooms: 2,
    area: 900,
    rent: 14000,
    status: "vacant",
    tenant: "",
  },
  {
    id: "C-301",
    tower: "Tower C",
    floor: "Floor 3",
    type: "1BHK",
    bedrooms: 1,
    area: 600,
    rent: 9000,
    status: "occupied",
    tenant: "Sophia Thomas",
  },
  {
    id: "C-302",
    tower: "Tower C",
    floor: "Floor 3",
    type: "2BHK",
    bedrooms: 2,
    area: 900,
    rent: 14000,
    status: "occupied",
    tenant: "Daniel White",
  },
];

/** Rents are quoted in rupees, matching the mock data. */
export function formatRent(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function countByStatus(list: Unit[], status: UnitStatus) {
  return list.filter((unit) => unit.status === status).length;
}
