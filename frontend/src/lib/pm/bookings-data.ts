import type { PillTone } from "@/components/pm/ui/pill";

/**
 * Mock facility bookings. Swap for a `src/lib/api.ts` call when the backend
 * lands.
 */

export const BOOKING_STATUSES = ["Pending", "Approved", "Rejected"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_STATUS_TONE: Record<BookingStatus, PillTone> = {
  Pending: "amber",
  Approved: "green",
  Rejected: "red",
};

export type Booking = {
  id: string;
  facility: string;
  location: string;
  purpose: string;
  bookedBy: string;
  unit: string;
  date: string;
  time: string;
  guests: number;
  status: BookingStatus;
};

export const bookings: Booking[] = [
  {
    id: "FB-001",
    facility: "Community Hall",
    location: "Ground Floor, Tower C",
    purpose: "Birthday Party",
    bookedBy: "Laura Martinez",
    unit: "C-101",
    date: "2026-08-10",
    time: "18:00 - 22:00",
    guests: 50,
    status: "Approved",
  },
  {
    id: "FB-002",
    facility: "Tennis Court",
    location: "Outdoor, Tower B",
    purpose: "Practice Session",
    bookedBy: "Robert Taylor",
    unit: "B-101",
    date: "2026-08-08",
    time: "07:00 - 09:00",
    guests: 2,
    status: "Approved",
  },
  {
    id: "FB-003",
    facility: "Swimming Pool",
    location: "Pool Area, Tower B",
    purpose: "Kids Swimming Party",
    bookedBy: "Amanda Clark",
    unit: "B-102",
    date: "2026-08-12",
    time: "10:00 - 12:00",
    guests: 15,
    status: "Pending",
  },
  {
    id: "FB-004",
    facility: "Community Hall",
    location: "Ground Floor, Tower C",
    purpose: "Corporate Meeting",
    bookedBy: "Kevin Anderson",
    unit: "C-102",
    date: "2026-08-15",
    time: "09:00 - 17:00",
    guests: 40,
    status: "Pending",
  },
  {
    id: "FB-005",
    facility: "Tennis Court",
    location: "Outdoor, Tower B",
    purpose: "Doubles Match",
    bookedBy: "James Wilson",
    unit: "B-201",
    date: "2026-08-09",
    time: "18:00 - 20:00",
    guests: 4,
    status: "Rejected",
  },
  {
    id: "FB-006",
    facility: "Swimming Pool",
    location: "Pool Area, Tower B",
    purpose: "Morning Lap Swimming",
    bookedBy: "Sarah Johnson",
    unit: "A-102",
    date: "2026-08-14",
    time: "06:00 - 08:00",
    guests: 1,
    status: "Approved",
  },
  {
    id: "FB-007",
    facility: "Community Hall",
    location: "Ground Floor, Tower C",
    purpose: "Wedding Reception",
    bookedBy: "Emily Davis",
    unit: "A-201",
    date: "2026-08-20",
    time: "18:00 - 23:00",
    guests: 150,
    status: "Pending",
  },
  {
    id: "FB-008",
    facility: "Parking Lot A",
    location: "Basement, Tower A",
    purpose: "Guest Parking",
    bookedBy: "John Doe",
    unit: "A-101",
    date: "2026-08-10",
    time: "08:00 - 18:00",
    guests: 3,
    status: "Approved",
  },
];

/** Card heading — "Community Hall - Birthday Party". */
export function bookingTitle(booking: Booking) {
  return `${booking.facility} - ${booking.purpose}`;
}
