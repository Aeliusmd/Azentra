import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "Technician List",
};

export default function FsTechniciansPage() {
  return (
    <FsSectionPlaceholder
      title="Technician List"
      subtitle="Skills, availability and current workload across the roster"
    />
  );
}
