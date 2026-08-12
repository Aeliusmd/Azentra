import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "Performance",
};

export default function FsPerformancePage() {
  return (
    <FsSectionPlaceholder
      title="Performance"
      subtitle="Completion rates, response times and technician ratings"
    />
  );
}
