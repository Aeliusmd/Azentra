import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "Site Visits",
};

export default function FsSiteVisitsPage() {
  return (
    <FsSectionPlaceholder
      title="Site Visits"
      subtitle="Walkthroughs, damage assessments and follow-up rounds"
    />
  );
}
