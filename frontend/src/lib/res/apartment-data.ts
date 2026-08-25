import { monthAndYear } from "@/lib/res/format";

/**
 * The unit's own records: the parking it holds, the cars on it, and anyone
 * leasing it.
 *
 * All of it belongs to this household. The bay allocation itself is the
 * property's to decide — a resident can say which car sits in their own slot,
 * never how many slots they get.
 */

/* -------------------------------- Parking --------------------------------- */

/** Bays allocated to this unit by the property. */
export const ALLOCATED_SLOTS = 2;

export type ParkingSlot = {
  /** The property's reference for the bay — `P-042`. */
  id: string;
  /** What is painted on the floor — `B1-42`. */
  bay: string;
  /** `Covered` or `Open`. */
  cover: "Covered" | "Open";
  /** Plate of the car parked there, or null while the bay is spare. */
  plate: string | null;
  status: "Active" | "Inactive";
};

export const parkingSlots: ParkingSlot[] = [
  {
    id: "P-042",
    bay: "B1-42",
    cover: "Covered",
    plate: "ABC 1234",
    status: "Active",
  },
];

/** Bays the unit is entitled to but has not taken up. */
export function slotsAvailable(slots: ParkingSlot[]) {
  return Math.max(0, ALLOCATED_SLOTS - slots.length);
}

/* -------------------------------- Vehicles -------------------------------- */

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  /** Registration plate — the key the parking bay refers to. */
  plate: string;
  status: "Active" | "Pending";
};

export const vehicles: Vehicle[] = [
  {
    id: "VEH-1",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    color: "Silver",
    plate: "ABC 1234",
    status: "Active",
  },
  {
    id: "VEH-2",
    make: "Honda",
    model: "Civic",
    year: 2024,
    color: "White",
    plate: "XYZ 5678",
    status: "Active",
  },
];

/** `Toyota Camry` — the heading on a vehicle row. */
export function vehicleName(vehicle: Vehicle) {
  return `${vehicle.make} ${vehicle.model}`;
}

/**
 * `Toyota Camry 2023 - ABC 1234`, as the parking row states it.
 *
 * Composed from the vehicle record rather than written onto the bay, so a plate
 * corrected on the Vehicles tab is corrected here too.
 */
export function vehicleLabel(vehicle: Vehicle) {
  return `${vehicleName(vehicle)} ${vehicle.year} - ${vehicle.plate}`;
}

export function vehicleByPlate(plate: string | null, list: Vehicle[]) {
  if (!plate) return null;
  return list.find((vehicle) => vehicle.plate === plate) ?? null;
}

/* --------------------------------- Tenants -------------------------------- */

export type Tenant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** ISO days bounding the lease. */
  leaseStart: string;
  leaseEnd: string;
  /** Monthly rent in LKR. */
  rent: number;
  status: "Active" | "Invited" | "Ended";
};

export const tenants: Tenant[] = [
  {
    id: "TEN-1",
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 555 0388",
    leaseStart: "2026-06-01",
    leaseEnd: "2027-05-31",
    rent: 85_000,
    status: "Active",
  },
];

/** `June 2026 - May 2027`, the lease line under a tenant's name. */
export function leaseRange(tenant: Tenant) {
  return `${monthAndYear(tenant.leaseStart.slice(0, 7))} - ${monthAndYear(
    tenant.leaseEnd.slice(0, 7),
  )}`;
}
