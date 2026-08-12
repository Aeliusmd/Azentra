import type { Metadata } from "next";

import { FsDashboardView } from "@/components/fs/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Field Supervisor Dashboard",
};

export default function FieldSupervisorDashboardPage() {
  return <FsDashboardView />;
}
