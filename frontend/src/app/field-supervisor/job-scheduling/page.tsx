import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "Job Scheduling",
};

export default function FsJobSchedulingPage() {
  return (
    <FsSectionPlaceholder
      title="Job Scheduling"
      subtitle="Book, reschedule and check technician time slots"
    />
  );
}
