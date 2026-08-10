import type { PillTone } from "@/components/pm/ui/pill";

/** Mock property assets. Swap for a `src/lib/api.ts` call when the backend lands. */

export const ASSET_CATEGORIES = [
  "Elevator",
  "Generator",
  "Pool Equipment",
  "Gym Equipment",
  "Security",
  "Safety",
  "Utilities",
  "HVAC",
  "Sports Equipment",
] as const;
export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

export const ASSET_STATUSES = [
  "Active",
  "Maintenance Due",
  "Under Repair",
  "Out of Service",
] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

export const ASSET_STATUS_TONE: Record<AssetStatus, PillTone> = {
  Active: "green",
  "Maintenance Due": "amber",
  "Under Repair": "amber",
  "Out of Service": "red",
};

export type Asset = {
  id: string;
  name: string;
  category: AssetCategory;
  location: string;
  vendor: string;
  model: string;
  serial: string;
  purchaseDate: string;
  warrantyExpiry: string;
  lastServiced: string;
  nextService: string;
  status: AssetStatus;
};

export const assets: Asset[] = [
  {
    id: "AS-001",
    name: "Elevator - Tower A",
    category: "Elevator",
    location: "Tower A",
    vendor: "ElevatorPro Services",
    model: "Otis Gen2 Comfort",
    serial: "OT-SR-A-001",
    purchaseDate: "2022-06-15",
    warrantyExpiry: "2027-06-15",
    lastServiced: "2026-07-15",
    nextService: "2026-08-15",
    status: "Active",
  },
  {
    id: "AS-002",
    name: "Elevator - Tower B",
    category: "Elevator",
    location: "Tower B",
    vendor: "ElevatorPro Services",
    model: "Otis Gen2 Comfort",
    serial: "OT-SR-B-002",
    purchaseDate: "2022-06-15",
    warrantyExpiry: "2027-06-15",
    lastServiced: "2026-07-20",
    nextService: "2026-08-20",
    status: "Active",
  },
  {
    id: "AS-003",
    name: "Generator - 500kVA",
    category: "Generator",
    location: "Basement, Tower A",
    vendor: "PowerGen Systems",
    model: "Cummins C500D5",
    serial: "CM-GEN-500-003",
    purchaseDate: "2021-11-20",
    warrantyExpiry: "2026-11-20",
    lastServiced: "2026-08-01",
    nextService: "2026-08-15",
    status: "Active",
  },
  {
    id: "AS-004",
    name: "Swimming Pool Pump",
    category: "Pool Equipment",
    location: "Pool Area, Tower B",
    vendor: "AquaClean Services",
    model: "Pentair IntelliFlo VSF",
    serial: "PN-PMP-004",
    purchaseDate: "2023-01-10",
    warrantyExpiry: "2028-01-10",
    lastServiced: "2026-08-04",
    nextService: "2026-08-11",
    status: "Active",
  },
  {
    id: "AS-005",
    name: "Gym Treadmill x4",
    category: "Gym Equipment",
    location: "Gym, Tower A 1st Floor",
    vendor: "FitEquip Pro",
    model: "Life Fitness T5 Track+",
    serial: "LF-T5-005",
    purchaseDate: "2023-03-05",
    warrantyExpiry: "2026-03-05",
    lastServiced: "2026-06-15",
    nextService: "2026-09-15",
    status: "Active",
  },
  {
    id: "AS-006",
    name: "CCTV DVR System",
    category: "Security",
    location: "Security Room, Tower A",
    vendor: "SecureView Tech",
    model: "Hikvision DS-7716NI",
    serial: "HK-DVR-006",
    purchaseDate: "2022-08-14",
    warrantyExpiry: "2027-08-14",
    lastServiced: "2026-06-01",
    nextService: "2026-09-01",
    status: "Active",
  },
  {
    id: "AS-007",
    name: "Fire Alarm Panel",
    category: "Safety",
    location: "Main Lobby, All Towers",
    vendor: "FireSafe Inc",
    model: "Honeywell NFS2-640",
    serial: "HW-FAP-007",
    purchaseDate: "2022-06-15",
    warrantyExpiry: "2027-06-15",
    lastServiced: "2026-07-25",
    nextService: "2026-08-25",
    status: "Active",
  },
  {
    id: "AS-008",
    name: "Water Treatment Plant",
    category: "Utilities",
    location: "Basement, Tower C",
    vendor: "HydroTech Services",
    model: "Grundfos AQpure",
    serial: "GF-WTP-008",
    purchaseDate: "2022-09-01",
    warrantyExpiry: "2027-09-01",
    lastServiced: "2026-08-03",
    nextService: "2026-08-17",
    status: "Active",
  },
  {
    id: "AS-009",
    name: "Gym AC Unit",
    category: "HVAC",
    location: "Gym, Tower A 1st Floor",
    vendor: "CoolAir Solutions",
    model: "Daikin FTKF50",
    serial: "DK-AC-009",
    purchaseDate: "2023-02-01",
    warrantyExpiry: "2026-02-01",
    lastServiced: "2026-05-10",
    nextService: "2026-08-10",
    status: "Under Repair",
  },
  {
    id: "AS-010",
    name: "Tennis Court Floodlights",
    category: "Sports Equipment",
    location: "Outdoor, Tower B",
    vendor: "SportsLight Co",
    model: "Philips ArenaVision LED",
    serial: "PH-FL-010",
    purchaseDate: "2023-05-12",
    warrantyExpiry: "2028-05-12",
    lastServiced: "2026-07-01",
    nextService: "2026-10-01",
    status: "Active",
  },
];

export function nextAssetId(list: Asset[]) {
  const highest = list.reduce((max, asset) => {
    const value = Number(asset.id.replace("AS-", ""));
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
  return `AS-${String(highest + 1).padStart(3, "0")}`;
}
