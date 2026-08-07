/**
 * Mock notifications. The first three come from the design; the rest are
 * placeholders so the full notifications page has more to show than the
 * dropdown's preview. Replace with a `src/lib/api.ts` call when the backend
 * lands.
 */

export type NotificationTone = "success" | "warning" | "info";

export const TONE_DOT: Record<NotificationTone, string> = {
  success: "bg-[#22a35c]",
  warning: "bg-[#e8a33d]",
  info: "bg-[#4a7fb5]",
};

export type Notification = {
  id: string;
  tone: NotificationTone;
  title: string;
  detail: string;
  time: string;
  read: boolean;
};

export const notifications: Notification[] = [
  {
    id: "1",
    tone: "success",
    title: "New company registered",
    detail: "Skyline Properties joined",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    tone: "warning",
    title: "License expiring",
    detail: "Green Heights license expires in 3 days",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "3",
    tone: "info",
    title: "System update completed",
    detail: "v2.4.1 deployed successfully",
    time: "3 hr ago",
    read: false,
  },
  {
    id: "4",
    tone: "warning",
    title: "Maintenance request overdue",
    detail: "MR-2026-031 in Tower C is past its SLA",
    time: "5 hr ago",
    read: false,
  },
  {
    id: "5",
    tone: "success",
    title: "Payment received",
    detail: "$3,200.00 cleared for invoice INV-2026-009",
    time: "8 hr ago",
    read: true,
  },
  {
    id: "6",
    tone: "info",
    title: "Facility booking confirmed",
    detail: "Community Hall reserved for August 15th",
    time: "Yesterday",
    read: true,
  },
  {
    id: "7",
    tone: "warning",
    title: "Occupancy below target",
    detail: "Tower D is at 0% — 32 units still vacant",
    time: "Yesterday",
    read: true,
  },
  {
    id: "8",
    tone: "success",
    title: "Inspection passed",
    detail: "Fire safety inspection cleared for all common areas",
    time: "2 days ago",
    read: true,
  },
  {
    id: "9",
    tone: "info",
    title: "New resident registered",
    detail: "Patricia Brown moved into Tower A, Unit 1201",
    time: "3 days ago",
    read: true,
  },
];
