/**
 * The visit log.
 *
 * One list, read by both the dashboard and the visitor screens, so a figure on
 * a tile can never disagree with the row it is counting. A record is written by
 * a resident raising a request or by this desk registering a caller at the
 * gate; from there the only things that change are the status and the two
 * stamps, which are the desk's to set and nobody else's.
 */

/** The day the seeded portal is standing in. */
export const TODAY = "2026-08-07";

/**
 * Where a visit stands.
 *
 * `Pending` is a request sitting on this desk. `Approved` has been cleared but
 * nobody has arrived. Only `Checked In` means somebody is actually on site.
 */
export const SO_VISIT_STATUSES = [
  "Pending",
  "Approved",
  "Checked In",
  "Checked Out",
  "Rejected",
  "Expired",
] as const;
export type SoVisitStatus = (typeof SO_VISIT_STATUSES)[number];

/** What a visitor drove in, where they drove in at all. */
export type SoVehicle = {
  /** `Sedan`, `SUV`, `Truck` — as the gate log records it. */
  type: string;
  /** Doubles as the parking pass code once a bay is granted. */
  plate: string;
};

/** The identification a guard checks at the desk. */
export const SO_ID_TYPES = [
  "Driver License",
  "National ID",
  "Passport",
  "Company ID",
] as const;
export type SoIdType = (typeof SO_ID_TYPES)[number];

export type SoVisit = {
  id: string;
  propertyId: string;
  /** The caller. */
  name: string;
  phone: string;
  idType: SoIdType;
  idNumber: string;
  /** Who they are here to see, and where. */
  resident: string;
  unit: string;
  /** ISO day of the visit. */
  date: string;
  /** 24-hour `HH:MM` they are expected. */
  expectedAt: string;
  purpose: string;
  /** Present means a bay was granted as well as a car logged. */
  vehicle: SoVehicle | null;
  /** Printed on the pass and quoted back at check-out. */
  passCode: string;
  /** Stamped at the gate by this desk. */
  checkedInAt: string | null;
  checkedOutAt: string | null;
  status: SoVisitStatus;
};

/**
 * The log as it stands.
 *
 * Six visits fall on today, two more are cleared for the days after, and one
 * ran yesterday — which is what the dashboard's seven figures count.
 */
export const soVisits: SoVisit[] = [
  {
    id: "V-2026-0201",
    propertyId: "sunrise",
    name: "John Williams",
    phone: "+1 555 0201",
    idType: "Driver License",
    idNumber: "DL-4471982",
    resident: "Robert Taylor",
    unit: "A-1205",
    date: TODAY,
    expectedAt: "14:30",
    purpose: "Personal Visit",
    vehicle: { type: "Sedan", plate: "TX-7AB-4421" },
    passCode: "VP-001-X7",
    checkedInAt: "14:32",
    checkedOutAt: null,
    status: "Checked In",
  },
  {
    id: "V-2026-0202",
    propertyId: "sunrise",
    name: "Sarah Mitchell",
    phone: "+1 555 0202",
    idType: "National ID",
    idNumber: "NIC-889210",
    resident: "Lisa Anderson",
    unit: "B-304",
    date: TODAY,
    expectedAt: "15:00",
    purpose: "Dinner Visit",
    vehicle: { type: "SUV", plate: "TX-3CD-8912" },
    passCode: "VP-002-K4",
    checkedInAt: null,
    checkedOutAt: null,
    status: "Approved",
  },
  {
    id: "V-2026-0203",
    propertyId: "sunrise",
    name: "David Chen",
    phone: "+1 555 0203",
    idType: "Company ID",
    idNumber: "EMP-30117",
    resident: "Emily Roberts",
    unit: "A-802",
    date: TODAY,
    expectedAt: "10:00",
    purpose: "Package Delivery",
    vehicle: null,
    passCode: "VP-003-B9",
    checkedInAt: "10:05",
    checkedOutAt: "11:45",
    status: "Checked Out",
  },
  {
    id: "V-2026-0204",
    propertyId: "sunrise",
    name: "Amanda Foster",
    phone: "+1 555 0204",
    idType: "Driver License",
    idNumber: "DL-2255431",
    resident: "James Wilson",
    unit: "C-1501",
    date: "2026-08-08",
    expectedAt: "09:00",
    purpose: "Maintenance Inspection",
    vehicle: { type: "Van", plate: "TX-9EF-5543" },
    passCode: "VP-004-D2",
    checkedInAt: null,
    checkedOutAt: null,
    status: "Pending",
  },
  {
    id: "V-2026-0205",
    propertyId: "sunrise",
    name: "Kevin Morris",
    phone: "+1 555 0205",
    idType: "Driver License",
    idNumber: "DL-6610294",
    resident: "Maria Garcia",
    unit: "B-607",
    date: TODAY,
    expectedAt: "16:00",
    purpose: "Social Gathering",
    vehicle: { type: "Sedan", plate: "TX-2GH-6678" },
    passCode: "VP-005-M2",
    checkedInAt: "16:05",
    checkedOutAt: null,
    status: "Checked In",
  },
  {
    id: "V-2026-0206",
    propertyId: "sunrise",
    name: "Rachel Green",
    phone: "+1 555 0206",
    idType: "National ID",
    idNumber: "NIC-471003",
    resident: "David Park",
    unit: "A-1103",
    date: "2026-08-06",
    expectedAt: "13:00",
    purpose: "Personal Visit",
    vehicle: null,
    passCode: "VP-006-R7",
    checkedInAt: "13:02",
    checkedOutAt: "14:58",
    status: "Checked Out",
  },
  {
    id: "V-2026-0207",
    propertyId: "sunrise",
    name: "Thomas Baker",
    phone: "+1 555 0207",
    idType: "Company ID",
    idNumber: "EMP-77420",
    resident: "Sarah Chen",
    unit: "C-905",
    date: "2026-08-08",
    expectedAt: "11:30",
    purpose: "Business Meeting",
    vehicle: { type: "Sedan", plate: "TX-4IJ-3344" },
    passCode: "VP-007-T3",
    checkedInAt: null,
    checkedOutAt: null,
    status: "Approved",
  },
  {
    id: "V-2026-0208",
    propertyId: "sunrise",
    name: "Jessica White",
    phone: "+1 555 0208",
    idType: "Driver License",
    idNumber: "DL-9902187",
    resident: "Alex Morgan",
    unit: "B-210",
    date: TODAY,
    expectedAt: "18:00",
    purpose: "Dinner Visit",
    vehicle: { type: "SUV", plate: "TX-5KL-9981" },
    passCode: "VP-008-J8",
    checkedInAt: null,
    checkedOutAt: null,
    status: "Pending",
  },
  {
    id: "V-2026-0209",
    propertyId: "sunrise",
    name: "Mark Stevens",
    phone: "+1 555 0209",
    idType: "Company ID",
    idNumber: "EMP-51188",
    resident: "Robert Taylor",
    unit: "A-1205",
    date: "2026-08-09",
    expectedAt: "10:00",
    purpose: "Plumbing Service",
    vehicle: { type: "Truck", plate: "TX-6MN-2211" },
    passCode: "VP-009-S5",
    checkedInAt: null,
    checkedOutAt: null,
    status: "Approved",
  },
  {
    id: "V-2026-0210",
    propertyId: "sunrise",
    name: "Linda Cooper",
    phone: "+1 555 0210",
    idType: "National ID",
    idNumber: "NIC-330842",
    resident: "Emily Roberts",
    unit: "A-802",
    date: TODAY,
    expectedAt: "08:30",
    purpose: "Food Delivery",
    vehicle: null,
    passCode: "VP-010-L1",
    checkedInAt: "08:33",
    checkedOutAt: "08:55",
    status: "Checked Out",
  },
  {
    id: "V-2026-0301",
    propertyId: "green-valley",
    name: "Omar Haddad",
    phone: "+1 555 0301",
    idType: "Company ID",
    idNumber: "EMP-11804",
    resident: "Ishara Wickrama",
    unit: "B1-405",
    date: TODAY,
    expectedAt: "10:00",
    purpose: "Internet Installation",
    vehicle: { type: "Van", plate: "GV-1180-QQ" },
    passCode: "VP-101-H4",
    checkedInAt: "10:07",
    checkedOutAt: null,
    status: "Checked In",
  },
  {
    id: "V-2026-0302",
    propertyId: "green-valley",
    name: "Sofia Reyes",
    phone: "+1 555 0302",
    idType: "Passport",
    idNumber: "P-8842119",
    resident: "Kasun Alwis",
    unit: "B2-118",
    date: TODAY,
    expectedAt: "12:15",
    purpose: "Personal Visit",
    vehicle: null,
    passCode: "VP-102-R2",
    checkedInAt: "12:20",
    checkedOutAt: "14:05",
    status: "Checked Out",
  },
  {
    id: "V-2026-0303",
    propertyId: "green-valley",
    name: "Peter Lund",
    phone: "+1 555 0303",
    idType: "Driver License",
    idNumber: "DL-7742006",
    resident: "Kasun Alwis",
    unit: "B2-118",
    date: "2026-08-09",
    expectedAt: "19:30",
    purpose: "Dinner Visit",
    vehicle: { type: "Sedan", plate: "GV-7742-KL" },
    passCode: "VP-103-P6",
    checkedInAt: null,
    checkedOutAt: null,
    status: "Approved",
  },
];

/* -------------------------------------------------------------------------- */
/* Slices                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Every slice below keeps the log's own order rather than re-sorting. The log
 * is written in the order visits were raised, which is the order a guard
 * already has in their head.
 */

export function visitsAt(propertyId: string, visits: SoVisit[]) {
  return visits.filter((visit) => visit.propertyId === propertyId);
}

/** Everything falling on the current day, whatever became of it. */
export function visitsOn(visits: SoVisit[], day: string = TODAY) {
  return visits.filter((visit) => visit.date === day);
}

/** Cleared, and still to come on a later day — the dashboard's "Expected". */
export function expectedLater(visits: SoVisit[], day: string = TODAY) {
  return visits.filter(
    (visit) => visit.status === "Approved" && visit.date > day,
  );
}

/** Sitting on this desk, waiting to be approved or turned away. */
export function awaitingApproval(visits: SoVisit[]) {
  return visits.filter((visit) => visit.status === "Pending");
}

/** Cleared and not yet arrived — the queue the check-in desk works from. */
export function readyToCheckIn(visits: SoVisit[]) {
  return visits.filter((visit) => visit.status === "Approved");
}

/** On site right now. */
export function insideProperty(visits: SoVisit[]) {
  return visits.filter((visit) => visit.status === "Checked In");
}

/** Admitted and gone home again. */
export function checkedOut(visits: SoVisit[]) {
  return visits.filter((visit) => visit.status === "Checked Out");
}

/**
 * Everyone who was actually admitted at some point — the history tab.
 * A request that was never let in has no movement to show.
 */
export function admittedVisits(visits: SoVisit[]) {
  return visits.filter((visit) => visit.checkedInAt !== null);
}

/**
 * The visits asking for a bay.
 *
 * A car only counts as a parking request while the visit is still ahead of the
 * barrier. Once somebody has driven in the bay is occupied rather than
 * requested, and once they have gone it is neither — so a guard working the
 * requests tab is never shown a decision that has already been made.
 */
export function parkingRequests(visits: SoVisit[]) {
  return visits.filter(
    (visit) =>
      visit.vehicle !== null &&
      (visit.status === "Pending" || visit.status === "Approved"),
  );
}

/** `Sedan · TX-7AB-4421`, as the check-in queue names a car. */
export function vehicleLine(vehicle: SoVehicle) {
  return `${vehicle.type} · ${vehicle.plate}`;
}

/** Free-text match across the fields a guard would type into the box. */
export function matchesVisitQuery(visit: SoVisit, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  return [
    visit.name,
    visit.phone,
    visit.resident,
    visit.unit,
    visit.purpose,
    visit.passCode,
    visit.vehicle?.plate ?? "",
  ].some((field) => field.toLowerCase().includes(needle));
}
