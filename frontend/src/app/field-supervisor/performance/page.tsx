import type { Metadata } from "next";

import { FsPerformanceView } from "@/components/fs/performance/performance-view";

export const metadata: Metadata = {
  title: "Performance",
};

export default function FsPerformancePage() {
  return <FsPerformanceView />;
}
