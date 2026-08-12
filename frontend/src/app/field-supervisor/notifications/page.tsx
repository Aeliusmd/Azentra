import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function FsNotificationsPage() {
  return (
    <FsSectionPlaceholder
      title="Notifications"
      subtitle="Job, technician and schedule alerts"
    />
  );
}
