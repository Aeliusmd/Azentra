/**
 * Mock data for User Management.
 *
 * Only John Doe's phone and created date come from the design; the other
 * users' are placeholders. Replace with `src/lib/api.ts` calls when the
 * backend lands.
 */

export const USER_ROLES = [
  "Resident",
  "Tenant",
  "Security Officer",
  "Technician",
  "Accountant",
  "Field Supervisor",
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ["active", "inactive", "disabled"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  /** Empty for users with no unit — the table renders a dash. */
  unit: string;
  tower: string;
  status: UserStatus;
  lastLogin: string;
  createdAt: string;
};

export const users: User[] = [
  {
    id: "john-doe",
    name: "John Doe",
    email: "johndoe@email.com",
    phone: "+1 555 1001",
    role: "Resident",
    unit: "A-101",
    tower: "Tower A",
    status: "active",
    lastLogin: "2026-07-28 09:15",
    createdAt: "2023-01-15",
  },
  {
    id: "sarah-miller",
    name: "Sarah Miller",
    email: "sarah.m@email.com",
    phone: "+1 555 1002",
    role: "Tenant",
    unit: "A-101",
    tower: "Tower A",
    status: "active",
    lastLogin: "2026-07-28 08:30",
    createdAt: "2023-02-08",
  },
  {
    id: "jane-smith",
    name: "Jane Smith",
    email: "janesmith@email.com",
    phone: "+1 555 1003",
    role: "Resident",
    unit: "A-102",
    tower: "Tower A",
    status: "active",
    lastLogin: "2026-07-27 20:00",
    createdAt: "2023-03-22",
  },
  {
    id: "robert-brown",
    name: "Robert Brown",
    email: "robert.b@email.com",
    phone: "+1 555 1004",
    role: "Resident",
    unit: "A-201",
    tower: "Tower A",
    status: "active",
    lastLogin: "2026-07-28 10:00",
    createdAt: "2023-05-04",
  },
  {
    id: "emily-white",
    name: "Emily White",
    email: "emily.w@email.com",
    phone: "+1 555 1005",
    role: "Tenant",
    unit: "A-201",
    tower: "Tower A",
    status: "disabled",
    lastLogin: "2026-05-10 12:00",
    createdAt: "2023-06-19",
  },
  {
    id: "michael-chen",
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "+1 555 1006",
    role: "Resident",
    unit: "B-101",
    tower: "Tower B",
    status: "active",
    lastLogin: "2026-07-28 07:30",
    createdAt: "2023-08-11",
  },
  {
    id: "william-davis",
    name: "William Davis",
    email: "w.davis@email.com",
    phone: "+1 555 1007",
    role: "Resident",
    unit: "B-102",
    tower: "Tower B",
    status: "inactive",
    lastLogin: "2026-06-15 14:20",
    createdAt: "2023-09-27",
  },
  {
    id: "david-park",
    name: "David Park",
    email: "david.park@email.com",
    phone: "+1 555 1008",
    role: "Tenant",
    unit: "A-202",
    tower: "Tower A",
    status: "active",
    lastLogin: "2026-07-28 11:00",
    createdAt: "2024-01-09",
  },
  {
    id: "olivia-taylor",
    name: "Olivia Taylor",
    email: "olivia.t@email.com",
    phone: "+1 555 1009",
    role: "Tenant",
    unit: "A-301",
    tower: "Tower A",
    status: "disabled",
    lastLogin: "2026-04-22 08:15",
    createdAt: "2024-02-14",
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    email: "jwilson@email.com",
    phone: "+1 555 1010",
    role: "Tenant",
    unit: "B-201",
    tower: "Tower B",
    status: "active",
    lastLogin: "2026-07-27 21:00",
    createdAt: "2024-04-30",
  },
  {
    id: "daniel-martinez",
    name: "Daniel Martinez",
    email: "d.martinez@email.com",
    phone: "+1 555 1011",
    role: "Security Officer",
    unit: "",
    tower: "Tower A",
    status: "disabled",
    lastLogin: "2026-03-18 16:45",
    createdAt: "2024-07-02",
  },
];

export const DEFAULT_INITIAL_PASSWORD = "Azentra@2026";

/** First letter of the name, for the avatar circle. */
export function initialOf(name: string) {
  return name.trim().charAt(0).toUpperCase();
}
