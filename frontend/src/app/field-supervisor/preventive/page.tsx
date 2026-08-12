import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "Preventive Maintenance",
};

export default function FsPreventivePage() {
  return (
    <FsSectionPlaceholder
      title="Preventive Maintenance"
      subtitle="Recurring servicing schedules and their upcoming rounds"
    />
  );
}
