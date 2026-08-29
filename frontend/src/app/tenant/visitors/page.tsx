import type { Metadata } from "next";

import { TenVisitorsView } from "@/components/ten/visitors/visitors-view";

export const metadata: Metadata = {
  title: "Visitors",
};

export default function TenantVisitorsPage() {
  return <TenVisitorsView />;
}
