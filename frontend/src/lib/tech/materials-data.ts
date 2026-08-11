import type { PillTone } from "@/components/pm/ui/pill";

/**
 * Store inventory the technician can draw on, and their own material requests.
 * Mock data — swap for a `src/lib/api.ts` call when the backend lands.
 *
 * The technician can see stock and ask for it; approving a request is the
 * supervisor's job, so nothing here changes a request's status.
 */

export const STOCK_LEVELS = ["In Stock", "Medium", "Low Stock"] as const;
export type StockLevel = (typeof STOCK_LEVELS)[number];

export const STOCK_TONE: Record<StockLevel, PillTone> = {
  "In Stock": "green",
  Medium: "amber",
  "Low Stock": "red",
};

export type Material = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  /** Free text so each item reads naturally: meter, tube, kit, kg. */
  unit: string;
  warehouse: string;
  stock: StockLevel;
};

export const inventory: Material[] = [
  {
    id: "MAT-01",
    name: 'PVC Pipe 2"',
    category: "Plumbing",
    quantity: 12,
    unit: "meter",
    warehouse: "Warehouse A",
    stock: "In Stock",
  },
  {
    id: "MAT-02",
    name: "Waterproof Sealant",
    category: "Plumbing",
    quantity: 8,
    unit: "tube",
    warehouse: "Warehouse A",
    stock: "In Stock",
  },
  {
    id: "MAT-03",
    name: "R-410A Refrigerant",
    category: "HVAC",
    quantity: 3,
    unit: "canister",
    warehouse: "Warehouse B",
    stock: "Medium",
  },
  {
    id: "MAT-04",
    name: "AC Filter",
    category: "HVAC",
    quantity: 15,
    unit: "unit",
    warehouse: "Warehouse B",
    stock: "In Stock",
  },
  {
    id: "MAT-05",
    name: "15A Outlets",
    category: "Electrical",
    quantity: 20,
    unit: "unit",
    warehouse: "Warehouse C",
    stock: "In Stock",
  },
  {
    id: "MAT-06",
    name: "Wire Nuts",
    category: "Electrical",
    quantity: 50,
    unit: "unit",
    warehouse: "Warehouse C",
    stock: "In Stock",
  },
  {
    id: "MAT-07",
    name: "Electrical Tape",
    category: "Electrical",
    quantity: 10,
    unit: "roll",
    warehouse: "Warehouse C",
    stock: "In Stock",
  },
  {
    id: "MAT-08",
    name: "Thermocouple",
    category: "Plumbing",
    quantity: 2,
    unit: "unit",
    warehouse: "Warehouse A",
    stock: "Low Stock",
  },
  {
    id: "MAT-09",
    name: "Smoke Detector Unit",
    category: "Safety",
    quantity: 6,
    unit: "unit",
    warehouse: "Warehouse B",
    stock: "In Stock",
  },
  {
    id: "MAT-10",
    name: "LED Bulbs E12",
    category: "Electrical",
    quantity: 24,
    unit: "unit",
    warehouse: "Warehouse C",
    stock: "In Stock",
  },
  {
    id: "MAT-11",
    name: "Drywall Patch Kit",
    category: "Carpentry",
    quantity: 4,
    unit: "kit",
    warehouse: "Warehouse A",
    stock: "In Stock",
  },
  {
    id: "MAT-12",
    name: "Wall Filler Compound",
    category: "Carpentry",
    quantity: 6,
    unit: "kg",
    warehouse: "Warehouse A",
    stock: "In Stock",
  },
];

export const REQUEST_STATUSES = [
  "Pending Approval",
  "Approved",
  "Rejected",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_STATUS_TONE: Record<RequestStatus, PillTone> = {
  "Pending Approval": "navy",
  Approved: "green",
  Rejected: "red",
};

export type MaterialRequest = {
  id: string;
  material: string;
  quantity: number;
  unit: string;
  status: RequestStatus;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  /** The job the material is for, e.g. "MT-1039". */
  jobRef?: string;
  reason?: string;
};

export const materialRequests: MaterialRequest[] = [
  {
    id: "RQ-001",
    material: "Intercom Handset X200",
    quantity: 1,
    unit: "unit",
    status: "Pending Approval",
    date: "2026-08-04",
    jobRef: "MT-1039",
    reason: "Existing handset faulty, wiring tested good.",
  },
  {
    id: "RQ-002",
    material: "Thermocouple",
    quantity: 1,
    unit: "unit",
    status: "Approved",
    date: "2026-08-06",
    jobRef: "MT-1042",
    reason: "Water heater thermostat cutting out.",
  },
  {
    id: "RQ-003",
    material: "Gas Valve Grease",
    quantity: 1,
    unit: "tube",
    status: "Approved",
    date: "2026-08-06",
    jobRef: "MT-1042",
  },
];

/** Next request id, continuing the RQ-0NN sequence. */
export function nextRequestId(current: MaterialRequest[]) {
  const highest = current.reduce((max, request) => {
    const value = Number(request.id.replace("RQ-", ""));
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
  return `RQ-${String(highest + 1).padStart(3, "0")}`;
}
