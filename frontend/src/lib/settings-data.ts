/**
 * Mock defaults for Settings. Replace with `src/lib/api.ts` calls when the
 * backend can persist them.
 */

export type PropertySettings = {
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  language: string;
  timezone: string;
};

export const propertySettings: PropertySettings = {
  name: "Sunrise Residence",
  code: "SR-2023-001",
  address: "123 Palm Avenue, Downtown, CA 90210",
  phone: "+1 555 123 4567",
  email: "management@sunriseresidence.com",
  language: "English",
  timezone: "UTC-08:00 Pacific Time",
};

export const LANGUAGES = ["English", "Spanish", "French", "German", "Sinhala"];

export const TIMEZONES = [
  "UTC-08:00 Pacific Time",
  "UTC-07:00 Mountain Time",
  "UTC-06:00 Central Time",
  "UTC-05:00 Eastern Time",
  "UTC+00:00 GMT",
  "UTC+05:30 India Standard Time",
];

export type FeatureToggle = {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
};

export const featureToggles: FeatureToggle[] = [
  {
    key: "maintenance",
    label: "Enable Maintenance Requests",
    description: "Allow residents to submit maintenance requests",
    enabled: true,
  },
  {
    key: "visitors",
    label: "Enable Visitor Pre-registration",
    description: "Allow residents to pre-register visitors",
    enabled: true,
  },
  {
    key: "payments",
    label: "Enable Online Payments",
    description: "Allow residents to pay bills online",
    enabled: true,
  },
  {
    key: "booking",
    label: "Enable Facility Booking",
    description: "Allow residents to book common areas",
    enabled: true,
  },
  {
    key: "announcements",
    label: "Enable Announcements",
    description: "Post community announcements to all residents",
    enabled: true,
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
    key: "resident-registered",
    label: "New resident registered",
    channels: { Email: true, Push: true, SMS: false },
  },
  {
    key: "maintenance-submitted",
    label: "Maintenance request submitted",
    channels: { Email: true, Push: true, SMS: false },
  },
  {
    key: "booking-confirmed",
    label: "Facility booking confirmed",
    channels: { Email: true, Push: false, SMS: false },
  },
  {
    key: "rent-received",
    label: "Rent payment received",
    channels: { Email: true, Push: false, SMS: false },
  },
  {
    key: "emergency-alert",
    label: "Emergency alert",
    channels: { Email: true, Push: true, SMS: true },
  },
  {
    key: "security-incident",
    label: "Security incident",
    channels: { Email: true, Push: true, SMS: true },
  },
  {
    key: "announcement-posted",
    label: "Announcement posted",
    channels: { Email: true, Push: true, SMS: false },
  },
];
