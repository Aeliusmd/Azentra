import type { Metadata } from "next";

import { TechDashboardView } from "@/components/tech/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Technician Dashboard",
};

export default function TechnicianDashboardPage() {
  return <TechDashboardView />;
}
