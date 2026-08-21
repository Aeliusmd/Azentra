import type { Metadata } from "next";

import { ResDashboardView } from "@/components/res/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Resident Dashboard",
};

export default function ResidentDashboardPage() {
  return <ResDashboardView />;
}
