/**
 * The officer on duty, and the post they are working.
 *
 * Read-only: a guard does not set their own roster. The shift, the property and
 * the gate come from the duty sheet the Property Manager publishes, and the
 * portal only states them back.
 */

export type SoShift = {
  /** `Morning`, `Evening`, `Night` — as the roster names them. */
  name: string;
  /** 24-hour `HH:MM`. */
  from: string;
  to: string;
};

export type SecurityOfficer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Badge number on the duty sheet. */
  badge: string;
  shift: SoShift;
  /** The site and entry point this shift is posted to. */
  propertyId: string;
  gate: string;
};

export const securityOfficer: SecurityOfficer = {
  firstName: "Michael",
  lastName: "Brown",
  email: "m.brown@azentra.com",
  phone: "+1 555 4180",
  badge: "SEC-0114",
  shift: { name: "Morning", from: "08:00", to: "16:00" },
  propertyId: "sunrise",
  gate: "Main Entrance",
};

export function soFullName(officer: SecurityOfficer = securityOfficer) {
  return `${officer.firstName} ${officer.lastName}`;
}

export function soInitials(officer: SecurityOfficer = securityOfficer) {
  return `${officer.firstName.charAt(0)}${officer.lastName.charAt(0)}`;
}

/** `Morning (08:00 - 16:00)`, as the shift card states it. */
export function shiftLine(shift: SoShift) {
  return `${shift.name} (${shift.from} - ${shift.to})`;
}
