import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "Field Reports",
};

export default function FsFieldReportsPage() {
  return (
    <FsSectionPlaceholder
      title="Field Reports"
      subtitle="Daily notes and observations from the field"
    />
  );
}
