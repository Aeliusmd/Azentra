import type { Metadata } from "next";

import { AccNotificationsView } from "@/components/acc/notifications/notifications-view";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function AccountantNotificationsPage() {
  return <AccNotificationsView />;
}
