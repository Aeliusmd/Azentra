/**
 * The signed-in resident and the unit they live in.
 *
 * One household, one unit — so unlike the staff portals there is no property
 * selector anywhere in this portal. Everything on every screen is scoped to
 * this record by construction rather than by a filter someone could get wrong.
 *
 * Unit A-304 is the same unit the Accountant portal bills: the invoice figures
 * here are the ones raised over there, so the two portals describe one flat.
 */

export type ResidentType = "Owner" | "Tenant";
export type OccupancyStatus = "Owner Occupied" | "Rented" | "Vacant";

export type ResidentUnit = {
  /** `A-304` — how the unit is named on every document. */
  number: string;
  building: string;
  floor: number;
  property: string;
  bedrooms: number;
  bathrooms: number;
  /** Internal floor area in square feet. */
  area: number;
  residentType: ResidentType;
  occupancy: OccupancyStatus;
  /** `2024-03` — when this resident took the unit on. */
  since: string;
};

export const residentUnit: ResidentUnit = {
  number: "A-304",
  building: "Tower A",
  floor: 3,
  property: "Sunrise Residence",
  bedrooms: 2,
  bathrooms: 2,
  area: 1_250,
  residentType: "Owner",
  occupancy: "Owner Occupied",
  since: "2024-03",
};

/** `A-304 · Tower A · Sunrise Residence` — the line under the welcome. */
export function unitLine(unit: ResidentUnit = residentUnit) {
  return `${unit.number} · ${unit.building} · ${unit.property}`;
}
