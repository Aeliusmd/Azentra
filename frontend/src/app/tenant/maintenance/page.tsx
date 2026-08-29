import type { Metadata } from "next";

import { TenMaintenanceView } from "@/components/ten/maintenance/maintenance-view";

export const metadata: Metadata = {
  title: "Maintenance",
};

export default function TenantMaintenancePage() {
  return <TenMaintenanceView />;
}
