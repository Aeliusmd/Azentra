import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "Emergency Jobs",
};

export default function FsEmergencyJobsPage() {
  return (
    <FsSectionPlaceholder
      title="Emergency Jobs"
      subtitle="Critical work that needs a technician on site now"
    />
  );
}
