import type { Metadata } from "next";

import { TenComplaintsView } from "@/components/ten/complaints/complaints-view";

export const metadata: Metadata = {
  title: "Complaints",
};

export default function TenantComplaintsPage() {
  return <TenComplaintsView />;
}
