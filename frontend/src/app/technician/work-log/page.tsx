import type { Metadata } from "next";

import { WorkLogView } from "@/components/tech/work-log/work-log-view";

export const metadata: Metadata = {
  title: "Labour & Work Log",
};

export default function WorkLogPage() {
  return <WorkLogView />;
}
