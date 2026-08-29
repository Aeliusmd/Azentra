import type { Metadata } from "next";

import { TenBillsView } from "@/components/ten/bills/bills-view";

export const metadata: Metadata = {
  title: "Bills & Payments",
};

export default function TenantBillsPage() {
  return <TenBillsView />;
}
