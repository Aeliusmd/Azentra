import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "Inspection Reports",
};

export default function FsInspectionsPage() {
  return (
    <FsSectionPlaceholder
      title="Inspection Reports"
      subtitle="Sign-off checklists, findings and follow-up actions"
    />
  );
}
