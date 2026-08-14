import type { Metadata } from "next";

import { FsFieldReportsView } from "@/components/fs/field-reports/field-reports-view";

export const metadata: Metadata = {
  title: "Field Reports",
};

export default function FsFieldReportsPage() {
  return <FsFieldReportsView />;
}
