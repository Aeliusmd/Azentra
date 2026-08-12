import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "Settings",
};

export default function FsSettingsPage() {
  return (
    <FsSectionPlaceholder
      title="Settings"
      subtitle="Notification and workflow preferences for your portal"
    />
  );
}
