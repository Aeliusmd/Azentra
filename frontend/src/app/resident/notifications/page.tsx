import type { Metadata } from "next";

import { ResNotificationsView } from "@/components/res/notifications/notifications-view";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function ResidentNotificationsPage() {
  return <ResNotificationsView />;
}
