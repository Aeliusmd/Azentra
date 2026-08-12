import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "Availability",
};

export default function FsAvailabilityPage() {
  return (
    <FsSectionPlaceholder
      title="Availability"
      subtitle="Shifts, leave and who is free to take work"
    />
  );
}
