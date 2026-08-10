import type { Metadata } from "next";

import { WorkOrdersView } from "@/components/pm/work-orders/work-orders-view";

export const metadata: Metadata = {
  title: "Work Orders",
};

export default function WorkOrdersPage() {
  return <WorkOrdersView />;
}
