import type { Metadata } from "next";

import { ResMaintenanceView } from "@/components/res/maintenance/maintenance-view";

export const metadata: Metadata = {
  title: "Maintenance",
};

export default function ResidentMaintenancePage() {
  return <ResMaintenanceView />;
}
