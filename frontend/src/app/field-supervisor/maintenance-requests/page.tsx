import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "Maintenance Requests",
};

export default function FsMaintenanceRequestsPage() {
  return (
    <FsSectionPlaceholder
      title="Maintenance Requests"
      subtitle="Resident and manager requests waiting to become work orders"
    />
  );
}
