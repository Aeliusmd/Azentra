import type { Metadata } from "next";

import { FsReportsView } from "@/components/fs/reports/reports-view";

export const metadata: Metadata = {
  title: "Reports",
};

export default function FsReportsPage() {
  return <FsReportsView />;
}
