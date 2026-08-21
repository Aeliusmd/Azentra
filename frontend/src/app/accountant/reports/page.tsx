import type { Metadata } from "next";

import { AccReportsView } from "@/components/acc/reports/reports-view";

export const metadata: Metadata = {
  title: "Reports",
};

export default function AccountantReportsPage() {
  return <AccReportsView />;
}
