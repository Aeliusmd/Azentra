import type { Metadata } from "next";

import { FsSectionPlaceholder } from "@/components/fs/ui/section-placeholder";

export const metadata: Metadata = {
  title: "Materials",
};

export default function FsMaterialsPage() {
  return (
    <FsSectionPlaceholder
      title="Materials"
      subtitle="Parts requested for jobs and what is holding work up"
    />
  );
}
