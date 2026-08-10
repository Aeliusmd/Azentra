/**
 * Mock defaults for the Property Manager settings screen. Swap for a
 * `src/lib/api.ts` call when the backend can persist them.
 */

export type PropertyInfo = {
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  officeHours: string;
  weekendHours: string;
  totalUnits: string;
  buildYear: string;
};

export const propertyInfo: PropertyInfo = {
  name: "Sunrise Residence",
  code: "SR-2023-001",
  address: "123 Palm Avenue, Downtown, CA 90210",
  phone: "+1 555 123 4567",
  email: "management@sunriseresidence.com",
  officeHours: "Mon-Fri 8:00 AM - 6:00 PM",
  weekendHours: "Sat-Sun 9:00 AM - 3:00 PM",
  totalUnits: "180",
  buildYear: "2018",
};

export type MaintenanceFeature = {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
};

export const maintenanceFeatures: MaintenanceFeature[] = [
  {
    key: "requests",
    label: "Enable Maintenance Requests",
    description:
      "Allow residents to submit maintenance requests through the portal",
    enabled: true,
  },
  {
    key: "auto-assign",
    label: "Auto-Assign Technicians",
    description:
      "Automatically assign the nearest available technician to new work orders",
    enabled: true,
  },
  {
    key: "preventive",
    label: "Preventive Maintenance Scheduling",
    description: "Auto-generate recurring preventive maintenance work orders",
    enabled: true,
  },
  {
    key: "ratings",
    label: "Resident Rating System",
    description: "Allow residents to rate completed maintenance work",
    enabled: true,
  },
];

/** Tile palette for the SLA row — keyed off the priority it represents. */
export type SlaTone = "red" | "amber" | "green" | "slate";

export type SlaTimeline = {
  key: string;
  label: string;
  value: string;
  tone: SlaTone;
};

export const slaTimelines: SlaTimeline[] = [
  { key: "emergency", label: "Emergency", value: "2 hours", tone: "red" },
  { key: "high", label: "High Priority", value: "24 hours", tone: "amber" },
  { key: "medium", label: "Medium Priority", value: "3 days", tone: "green" },
  { key: "low", label: "Low Priority", value: "7 days", tone: "slate" },
];

export const VENDOR_TIERS = [
  "Tier 1 - Platinum",
  "Tier 2 - Gold",
  "Tier 3 - Silver",
  "Tier 4 - Bronze",
] as const;

/** Quotes at or under this amount skip manager approval. */
export const autoApproveLimit = "500";

export type CommunityFeature = {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
};

export const communityFeatures: CommunityFeature[] = [
  {
    key: "booking",
    label: "Enable Facility Booking",
    description: "Allow residents to reserve common areas and amenities online",
    enabled: true,
  },
  {
    key: "advance-booking",
    label: "Require Advance Booking",
    description: "Residents must book facilities at least 24 hours in advance",
    enabled: false,
  },
  {
    key: "booking-approval",
    label: "Require Approval for Bookings",
    description:
      "All facility bookings need manager approval before confirmation",
    enabled: true,
  },
  {
    key: "announcements",
    label: "Enable Announcements",
    description: "Post community announcements visible to all residents",
    enabled: true,
  },
];

export type ManagedFacility = {
  id: string;
  name: string;
  hours: string;
  active: boolean;
};

/** Listed in the order the two-column grid reads across, then down. */
export const managedFacilities: ManagedFacility[] = [
  {
    id: "pool",
    name: "Swimming Pool",
    hours: "6:00 AM - 10:00 PM",
    active: true,
  },
  {
    id: "tennis",
    name: "Tennis Court",
    hours: "7:00 AM - 9:00 PM",
    active: true,
  },
  { id: "gym", name: "Gym", hours: "5:00 AM - 11:00 PM", active: true },
  { id: "bbq", name: "BBQ Area", hours: "9:00 AM - 9:00 PM", active: true },
  {
    id: "clubhouse",
    name: "Clubhouse",
    hours: "8:00 AM - 10:00 PM",
    active: true,
  },
  { id: "spa", name: "Spa & Sauna", hours: "8:00 AM - 8:00 PM", active: false },
  {
    id: "business-centre",
    name: "Business Center",
    hours: "7:00 AM - 7:00 PM",
    active: false,
  },
  {
    id: "rooftop",
    name: "Rooftop Lounge",
    hours: "10:00 AM - 11:00 PM",
    active: true,
  },
];

export const NOTIFICATION_CHANNELS = ["Email", "Push", "SMS"] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export type NotificationRule = {
  key: string;
  label: string;
  channels: Record<NotificationChannel, boolean>;
};

export const notificationRules: NotificationRule[] = [
  {
    key: "maintenance-submitted",
    label: "New maintenance request submitted",
    channels: { Email: true, Push: true, SMS: false },
  },
  {
    key: "work-order-overdue",
    label: "Work order past its due date",
    channels: { Email: true, Push: true, SMS: false },
  },
  {
    key: "technician-update",
    label: "Technician status update",
    channels: { Email: false, Push: true, SMS: false },
  },
  {
    key: "booking-request",
    label: "Facility booking request",
    channels: { Email: true, Push: true, SMS: false },
  },
  {
    key: "complaint-filed",
    label: "Resident complaint filed",
    channels: { Email: true, Push: true, SMS: false },
  },
  {
    key: "inspection-due",
    label: "Inspection due reminder",
    channels: { Email: true, Push: false, SMS: false },
  },
  {
    key: "asset-service",
    label: "Asset service alert",
    channels: { Email: true, Push: false, SMS: false },
  },
  {
    key: "emergency-request",
    label: "Emergency maintenance request",
    channels: { Email: true, Push: true, SMS: true },
  },
];
