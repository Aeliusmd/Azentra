/**
 * The visitor deck.
 *
 * A bay is either free or it is being held for somebody, and the holder is the
 * whole of what a guard needs: a name, a unit, a plate and the window it is
 * held for. Where that holder arrived through the gate log the bay carries the
 * visit id too, which is what lets a parking request and a visitor pass stay
 * the same fact rather than two that can drift apart.
 */

export const SLOT_STATUSES = ["Available", "Occupied", "Reserved"] as const;
export type SlotStatus = (typeof SLOT_STATUSES)[number];

export type SlotHolder = {
  name: string;
  unit: string;
  plate: string;
  /** 24-hour `HH:MM` the bay is held from and until. */
  arrival: string;
  departure: string;
  /** The gate record this came from, where it came from one at all. */
  visitId: string | null;
};

export type ParkingSlot = {
  id: string;
  propertyId: string;
  /** Deck level, as it is painted on the wall. */
  floor: string;
  status: SlotStatus;
  /** Null on a free bay. */
  holder: SlotHolder | null;
};

function free(propertyId: string, id: string, floor: string): ParkingSlot {
  return { id, propertyId, floor, status: "Available", holder: null };
}

function held(
  propertyId: string,
  id: string,
  floor: string,
  status: Exclude<SlotStatus, "Available">,
  holder: SlotHolder,
): ParkingSlot {
  return { id, propertyId, floor, status, holder };
}

/**
 * Fifteen bays on the Sunrise deck.
 *
 * `Occupied` means a car is in it now; `Reserved` means it is spoken for by a
 * visit that has not arrived. P-005 is neither — it is a resident of A-1205
 * overflowing into visitor parking, logged at the barrier rather than raised as
 * a pass, which is why it has no visit behind it.
 */
export const parkingSlots: ParkingSlot[] = [
  held("sunrise", "P-001", "G1", "Occupied", {
    name: "John Williams",
    unit: "A-1205",
    plate: "TX-7AB-4421",
    arrival: "14:32",
    departure: "17:00",
    visitId: "V-2026-0201",
  }),
  free("sunrise", "P-002", "G1"),
  held("sunrise", "P-003", "G1", "Reserved", {
    name: "Thomas Baker",
    unit: "C-905",
    plate: "TX-4IJ-3344",
    arrival: "11:30",
    departure: "13:30",
    visitId: "V-2026-0207",
  }),
  free("sunrise", "P-004", "G1"),
  held("sunrise", "P-005", "G1", "Occupied", {
    name: "Robert Taylor",
    unit: "A-1205",
    plate: "TX-8PQ-1170",
    arrival: "13:20",
    departure: "17:00",
    visitId: null,
  }),
  held("sunrise", "P-006", "G1", "Reserved", {
    name: "Sarah Mitchell",
    unit: "B-304",
    plate: "TX-3CD-8912",
    arrival: "15:00",
    departure: "18:30",
    visitId: "V-2026-0202",
  }),
  free("sunrise", "P-007", "G1"),
  held("sunrise", "P-008", "G1", "Occupied", {
    name: "Kevin Morris",
    unit: "B-607",
    plate: "TX-2GH-6678",
    arrival: "16:05",
    departure: "20:00",
    visitId: "V-2026-0205",
  }),
  held("sunrise", "P-009", "G1", "Reserved", {
    name: "Jessica White",
    unit: "B-210",
    plate: "TX-5KL-9981",
    arrival: "18:00",
    departure: "21:00",
    visitId: "V-2026-0208",
  }),
  free("sunrise", "P-010", "G1"),
  free("sunrise", "P-011", "G1"),
  held("sunrise", "P-012", "G1", "Reserved", {
    name: "Amanda Foster",
    unit: "C-1501",
    plate: "TX-9EF-5543",
    arrival: "09:00",
    departure: "11:00",
    visitId: "V-2026-0204",
  }),
  free("sunrise", "P-013", "G1"),
  free("sunrise", "P-014", "G1"),
  held("sunrise", "P-015", "G1", "Reserved", {
    name: "Mark Stevens",
    unit: "A-1205",
    plate: "TX-6MN-2211",
    arrival: "10:00",
    departure: "12:00",
    visitId: "V-2026-0209",
  }),
  held("green-valley", "G-001", "B1", "Occupied", {
    name: "Omar Haddad",
    unit: "B1-405",
    plate: "GV-1180-QQ",
    arrival: "10:07",
    departure: "16:00",
    visitId: "V-2026-0301",
  }),
  free("green-valley", "G-002", "B1"),
  free("green-valley", "G-003", "B1"),
  held("green-valley", "G-004", "B1", "Reserved", {
    name: "Peter Lund",
    unit: "B2-118",
    plate: "GV-7742-KL",
    arrival: "19:30",
    departure: "22:30",
    visitId: "V-2026-0303",
  }),
  free("green-valley", "G-005", "B1"),
  free("green-valley", "G-006", "B1"),
  free("green-valley", "G-007", "B1"),
  free("green-valley", "G-008", "B1"),
];

export function slotsAt(propertyId: string, slots: ParkingSlot[]) {
  return slots.filter((slot) => slot.propertyId === propertyId);
}

export function countSlots(slots: ParkingSlot[], status: SlotStatus) {
  return slots.filter((slot) => slot.status === status).length;
}

/** The bay a given gate record was given, where it was given one. */
export function slotForVisit(slots: ParkingSlot[], visitId: string) {
  return slots.find((slot) => slot.holder?.visitId === visitId) ?? null;
}

/** `09:00`–`11:00` → `2 hours`; halves read as `3.5 hours`. */
export function holdDuration(holder: SlotHolder) {
  const minutes = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  };

  const span = (minutes(holder.departure) - minutes(holder.arrival)) / 60;
  const rounded = Math.round(span * 2) / 2;

  return `${rounded} ${rounded === 1 ? "hour" : "hours"}`;
}
