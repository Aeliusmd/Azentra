import type { Metadata } from "next";

import { TenDashboardView } from "@/components/ten/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Tenant Dashboard",
};

export default function TenantDashboardPage() {
  return <TenDashboardView />;
}
