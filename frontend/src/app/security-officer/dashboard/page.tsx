import type { Metadata } from "next";

import { SoDashboardView } from "@/components/so/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Security Dashboard",
};

export default function SecurityOfficerDashboardPage() {
  return <SoDashboardView />;
}
