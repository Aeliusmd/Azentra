import type { PillTone } from "@/components/pm/ui/pill";

/**
 * Material the technicians have asked for, and where each request has got to.
 * Mock data — swap for a `src/lib/api.ts` call when the backend lands.
 *
 * Distinct from the `materials` on a work order: those are the lines already
 * drawn against a job, while these are the asks still waiting on a decision.
 */

export const MATERIAL_STATUSES = [
  "Pending",
  "Approved",
  "Rejected",
  "Ordered",
] as const;
export type MaterialStatus = (typeof MATERIAL_STATUSES)[number];

export const MATERIAL_STATUS_TONE: Record<MaterialStatus, PillTone> = {
  Pending: "amber",
  Approved: "green",
  Rejected: "red",
  Ordered: "navy",
};

export type FsMaterialRequest = {
  id: string;
  propertyId: string;
  material: string;
  /** Quantity as asked for, e.g. `5 meters`. */
  quantity: string;
  workOrderId: string;
  /** Title of the job the material is for. */
  job: string;
  technician: string;
  /** `YYYY-MM-DD HH:MM AM`. */
  requestedAt: string;
  status: MaterialStatus;
  /** Why the technician needs it. */
  reason: string;
  /** The supervisor's line once they have acted on it. */
  notes: string;
};

export const materialRequests: FsMaterialRequest[] = [
  {
    id: "MAT-001",
    propertyId: "sunrise",
    material: 'PVC Pipe 2"',
    quantity: "5 meters",
    workOrderId: "WO-1041",
    job: "Water Leakage - Bathroom Ceiling",
    technician: "John Perera",
    requestedAt: "2026-08-12 11:15 AM",
    status: "Approved",
    reason:
      "Existing pipe section damaged by corrosion. Need replacement section.",
    notes: "Approved. Standard pipe from inventory.",
  },
  {
    id: "MAT-002",
    propertyId: "sunrise",
    material: "Storage Heater 50L",
    quantity: "1 unit",
    workOrderId: "WO-1048",
    job: "Water Heater Replacement - Unit A-501",
    technician: "John Perera",
    requestedAt: "2026-08-12 09:20 AM",
    status: "Pending",
    reason: "Existing heater leaking from the base and out of warranty.",
    notes: "",
  },
  {
    id: "MAT-003",
    propertyId: "sunrise",
    material: "Door Interlock Switch",
    quantity: "1 unit",
    workOrderId: "WO-1042",
    job: "Elevator Malfunction - Tower A",
    technician: "Michael Torres",
    requestedAt: "2026-08-12 09:45 AM",
    status: "Approved",
    reason: "Level 4 interlock reads intermittent — lift stays out of service.",
    notes: "Approved as an emergency line. Contractor to fit today.",
  },
  {
    id: "MAT-004",
    propertyId: "sunrise",
    material: "Pump Bearing Kit",
    quantity: "1 set",
    workOrderId: "WO-1044",
    job: "Pool Pump Repair - Common Area",
    technician: "Sarah Wilson",
    requestedAt: "2026-08-12 08:50 AM",
    status: "Pending",
    reason: "Motor bearing seized. Kit needed to reassemble the housing.",
    notes: "",
  },
  {
    id: "MAT-005",
    propertyId: "sunrise",
    material: "Treadmill Belt 3-ply",
    quantity: "1 unit",
    workOrderId: "WO-1051",
    job: "Gym Treadmill Belt Replacement",
    technician: "Sarah Wilson",
    requestedAt: "2026-08-11 03:10 PM",
    status: "Ordered",
    reason: "Belt slipping under load. Machine tagged out of service.",
    notes: "On back order with the supplier — ETA 15 Aug.",
  },
  {
    id: "MAT-006",
    propertyId: "sunrise",
    material: "LED Driver 18W",
    quantity: "6 pcs",
    workOrderId: "WO-1046",
    job: "Corridor Lighting Flickering - Level 6",
    technician: "Tom Harrison",
    requestedAt: "2026-08-11 02:40 PM",
    status: "Approved",
    reason: "Six fittings flickering on the east wing, drivers failing.",
    notes: "Approved. Drawn from the Tower A store.",
  },
  {
    id: "MAT-007",
    propertyId: "sunrise",
    material: "Float Switch",
    quantity: "1 unit",
    workOrderId: "WO-1038",
    job: "Basement Sump Pump Service",
    technician: "Tom Harrison",
    requestedAt: "2026-08-11 10:05 AM",
    status: "Ordered",
    reason: "Float switch failed, pump will not cut in automatically.",
    notes: "Reorder placed 11 Aug.",
  },
  {
    id: "MAT-008",
    propertyId: "sunrise",
    material: "Replacement Extractor Fan 150mm",
    quantity: "1 unit",
    workOrderId: "WO-1050",
    job: "Exhaust Fan Noise - Unit B-115",
    technician: "Ahmed Khan",
    requestedAt: "2026-08-11 09:30 AM",
    status: "Rejected",
    reason: "Fan rattling under load, suggest full replacement.",
    notes: "Rejected — bearing service first, replace only if noise returns.",
  },
  {
    id: "MAT-101",
    propertyId: "green-valley",
    material: "Motor Capacitor 25uF",
    quantity: "2 pcs",
    workOrderId: "WO-2014",
    job: "Gate Motor Overheating - Block 2",
    technician: "Grace Lee",
    requestedAt: "2026-08-12 08:15 AM",
    status: "Pending",
    reason: "Motor cutting out after repeated cycles, capacitor suspect.",
    notes: "",
  },
  {
    id: "MAT-102",
    propertyId: "green-valley",
    material: "Wall Paint - Neutral",
    quantity: "10 litres",
    workOrderId: "WO-2015",
    job: "Corridor Repaint - Block 1 Level 4",
    technician: "Marco Rossi",
    requestedAt: "2026-08-07 11:00 AM",
    status: "Approved",
    reason: "Scuffed corridor walls after a move-out.",
    notes: "Approved. Two coats budgeted.",
  },
];

export function materialsAt(propertyId: string) {
  return materialRequests.filter(
    (request) => request.propertyId === propertyId,
  );
}

/** Waiting on the supervisor — these lead the list. */
export function isAwaitingDecision(request: FsMaterialRequest) {
  return request.status === "Pending";
}

/** Newest ask first, with anything still pending pulled to the top. */
export function byRequestOrder(a: FsMaterialRequest, b: FsMaterialRequest) {
  if (isAwaitingDecision(a) !== isAwaitingDecision(b)) {
    return isAwaitingDecision(a) ? -1 : 1;
  }
  return b.requestedAt.localeCompare(a.requestedAt);
}
