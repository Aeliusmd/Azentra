import type { Metadata } from "next";

import { PmDashboardView } from "@/components/pm/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Property Manager Dashboard",
};

export default function PropertyManagerDashboardPage() {
  return <PmDashboardView />;
}
