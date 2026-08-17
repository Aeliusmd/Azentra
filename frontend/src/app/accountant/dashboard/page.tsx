import type { Metadata } from "next";

import { AccDashboardView } from "@/components/acc/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Accountant Dashboard",
};

export default function AccountantDashboardPage() {
  return <AccDashboardView />;
}
