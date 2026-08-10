import type { Metadata } from "next";

import { MaintenanceView } from "@/components/pm/maintenance/maintenance-view";

export const metadata: Metadata = {
  title: "Maintenance Requests",
};

export default function MaintenancePage() {
  return <MaintenanceView />;
}
