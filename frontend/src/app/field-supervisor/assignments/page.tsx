import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "Assignments",
};

export default function FsAssignmentsPage() {
  return (
    <FsSectionPlaceholder
      title="Assignments"
      subtitle="Match unassigned jobs to the right technician"
    />
  );
}
