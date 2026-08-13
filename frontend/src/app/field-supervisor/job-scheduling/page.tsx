import type { Metadata } from "next";

import { FsJobSchedulingView } from "@/components/fs/job-scheduling/job-scheduling-view";

export const metadata: Metadata = {
  title: "Job Scheduling",
};

export default function FsJobSchedulingPage() {
  return <FsJobSchedulingView />;
}
