/**
 * Mock calendar events. Dates are fixed strings rather than derived from the
 * clock so the page renders identically on the server and the client.
 */

export const EVENT_TYPES = [
  "Maintenance",
  "Inspection",
  "Booking",
  "Announcement",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

/** Dot / marker colour per type. */
export const EVENT_COLOR: Record<EventType, string> = {
  Maintenance: "#22a35c",
  Inspection: "#e8a33d",
  Booking: "#2e6cad",
  Announcement: "#647a91",
};

export type CalendarEvent = {
  id: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  time: string;
  title: string;
  type: EventType;
};

/** The day the calendar opens on. */
export const TODAY = "2026-08-07";

export const calendarEvents: CalendarEvent[] = [
  // 7th — the selected day
  {
    id: "e1",
    date: "2026-08-07",
    time: "08:30",
    title: "Pool Safety Inspection",
    type: "Inspection",
  },
  {
    id: "e2",
    date: "2026-08-07",
    time: "09:00",
    title: "MR-001: Bathroom leak repair",
    type: "Maintenance",
  },
  {
    id: "e3",
    date: "2026-08-07",
    time: "14:00",
    title: "MR-005: Outlet replacement",
    type: "Maintenance",
  },

  {
    id: "e4",
    date: "2026-08-08",
    time: "10:00",
    title: "Community Hall booking — Perera family",
    type: "Booking",
  },
  {
    id: "e5",
    date: "2026-08-08",
    time: "15:00",
    title: "WO-008: Lobby chandelier bulb replacement",
    type: "Maintenance",
  },

  {
    id: "e6",
    date: "2026-08-09",
    time: "09:30",
    title: "WO-002: AC repair — A-102",
    type: "Maintenance",
  },
  {
    id: "e7",
    date: "2026-08-09",
    time: "18:00",
    title: "Tennis Court — Robert Taylor",
    type: "Booking",
  },

  {
    id: "e8",
    date: "2026-08-10",
    time: "08:00",
    title: "Gym booking — morning slot",
    type: "Booking",
  },
  {
    id: "e9",
    date: "2026-08-10",
    time: "11:00",
    title: "Common Area Condition Assessment",
    type: "Inspection",
  },
  {
    id: "e10",
    date: "2026-08-10",
    time: "16:00",
    title: "Rooftop terrace — private event",
    type: "Booking",
  },

  {
    id: "e11",
    date: "2026-08-11",
    time: "10:00",
    title: "Generator preventive service",
    type: "Maintenance",
  },

  {
    id: "e12",
    date: "2026-08-12",
    time: "09:00",
    title: "Community Hall booking — AGM setup",
    type: "Booking",
  },
  {
    id: "e13",
    date: "2026-08-12",
    time: "13:00",
    title: "Pest Control Inspection — Tower A",
    type: "Inspection",
  },
  {
    id: "e14",
    date: "2026-08-12",
    time: "17:30",
    title: "Tennis Court — Michael Chen",
    type: "Booking",
  },

  {
    id: "e15",
    date: "2026-08-14",
    time: "19:00",
    title: "Community Hall booking — birthday",
    type: "Booking",
  },

  {
    id: "e16",
    date: "2026-08-15",
    time: "09:00",
    title: "Elevator Safety Check — Tower A",
    type: "Inspection",
  },
  {
    id: "e17",
    date: "2026-08-15",
    time: "11:30",
    title: "Water pump servicing",
    type: "Maintenance",
  },
  {
    id: "e18",
    date: "2026-08-15",
    time: "16:00",
    title: "Gym booking — group session",
    type: "Booking",
  },

  {
    id: "e19",
    date: "2026-08-17",
    time: "10:00",
    title: "WO-006: Intercom system repair",
    type: "Maintenance",
  },

  {
    id: "e20",
    date: "2026-08-18",
    time: "18:30",
    title: "Rooftop terrace booking",
    type: "Booking",
  },

  {
    id: "e21",
    date: "2026-08-20",
    time: "10:00",
    title: "Fire hydrant pressure check",
    type: "Inspection",
  },
  {
    id: "e22",
    date: "2026-08-20",
    time: "15:00",
    title: "Community Hall booking — workshop",
    type: "Booking",
  },

  {
    id: "e23",
    date: "2026-08-25",
    time: "09:00",
    title: "Monthly Fire Safety Inspection",
    type: "Inspection",
  },
  {
    id: "e24",
    date: "2026-08-25",
    time: "14:00",
    title: "HVAC filter replacement — Tower B",
    type: "Maintenance",
  },
];

export function eventsOn(date: string) {
  return calendarEvents
    .filter((event) => event.date === date)
    .sort((a, b) => a.time.localeCompare(b.time));
}

/** `YYYY-MM-DD` for a year/month/day triple, without touching the clock. */
export function toIso(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
