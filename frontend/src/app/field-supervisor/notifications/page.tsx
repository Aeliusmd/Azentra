import type { Metadata } from "next";

import { FsNotificationsView } from "@/components/fs/notifications/notifications-view";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function FsNotificationsPage() {
  return <FsNotificationsView />;
}
