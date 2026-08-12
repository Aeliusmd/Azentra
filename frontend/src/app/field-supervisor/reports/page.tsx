import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "Reports",
};

export default function FsReportsPage() {
  return (
    <FsSectionPlaceholder
      title="Reports"
      subtitle="Operational reporting across jobs, technicians and sites"
    />
  );
}
