/**
 * Mock notifications for the topbar bell. Replace with a `src/lib/api.ts`
 * call when the backend lands.
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
];
