import type { Metadata } from "next";

import { TenNotificationsView } from "@/components/ten/notifications/notifications-view";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function TenantNotificationsPage() {
  return <TenNotificationsView />;
}
