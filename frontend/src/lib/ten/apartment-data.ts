/**
 * The parking bay this tenancy holds and the cars the tenant keeps on it.
 *
 * The split matters: the *bay* is the property's allocation — how many a
 * tenancy gets and which one is not the tenant's to decide, so nothing in this
 * portal writes to it. The *cars* are the tenant's own, and those they may add
 * and correct.
 */

/* -------------------------------- Parking --------------------------------- */

export type TenParkingSlot = {
  /** The property's reference for the bay — `P-118`. */
  id: string;
  /** What is painted on the floor — `B1-58`. */
  bay: string;
  /** Which level it sits on. */
  zone: string;
  cover: "Covered" | "Open";
  /** Plate of the car parked there, or null while the bay is spare. */
  plate: string | null;
  status: "Active" | "Inactive";
};

/**
 * Allocated to A-304 for the duration of the lease. One bay: a tenancy gets
 * what the lease grants it, and there is no control anywhere in this portal
 * that asks for another.
 */
export const tenantParkingSlot: TenParkingSlot = {
  id: "P-118",
  bay: "B1-42",
  zone: "Basement 1",
  cover: "Covered",
  plate: "DEF 5678",
  status: "Active",
};

/* -------------------------------- Vehicles -------------------------------- */

export const VEHICLE_TYPES = [
  "Car",
  "SUV",
  "Van",
  "Motorcycle",
  "Other",
] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export type TenVehicle = {
  id: string;
  /** Registration plate — the key the parking bay refers to. */
  plate: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  color: string;
  /**
   * `Pending` until the property has checked the plate against the bay. A
   * tenant can register a car; only the property can vouch for it at the gate.
   */
  status: "Active" | "Pending";
};

export const tenantVehicles: TenVehicle[] = [
  {
    id: "TVEH-1",
    plate: "DEF 5678",
    type: "Car",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    color: "Silver",
    status: "Active",
  },
  {
    id: "TVEH-2",
    plate: "GHI 9012",
    type: "Car",
    make: "Suzuki",
    model: "Wagon R",
    year: 2022,
    color: "White",
    status: "Active",
  },
];

/** `Suzuki Swift` — the heading on a vehicle row. */
export function vehicleName(vehicle: TenVehicle) {
  return `${vehicle.make} ${vehicle.model}`;
}

/** `Suzuki Swift 2022 - CBA 7719`, as the parking row states it. */
export function vehicleLabel(vehicle: TenVehicle) {
  return `${vehicleName(vehicle)} ${vehicle.year} - ${vehicle.plate}`;
}

/**
 * The bay a car sits in, worked out from the plate on the bay rather than
 * written onto the vehicle — so a plate corrected on the Vehicles tab moves the
 * car in the Parking tab too, and a tenant can never assign themselves a space
 * by editing their own record.
 */
export function slotForVehicle(
  vehicle: TenVehicle,
  slot: TenParkingSlot = tenantParkingSlot,
) {
  return slot.plate === vehicle.plate ? slot.bay : null;
}

export function vehicleByPlate(plate: string | null, list: TenVehicle[]) {
  if (!plate) return null;
  return list.find((vehicle) => vehicle.plate === plate) ?? null;
}
