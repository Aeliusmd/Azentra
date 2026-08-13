import type { Metadata } from "next";

import { FsEmergencyJobsView } from "@/components/fs/emergency-jobs/emergency-jobs-view";

export const metadata: Metadata = {
  title: "Emergency Jobs",
};

export default function FsEmergencyJobsPage() {
  return <FsEmergencyJobsView />;
}
