import type { Metadata } from "next";

import { AccUnitBillsView } from "@/components/acc/billing/unit-bills-view";

export const metadata: Metadata = {
  title: "Unit Bills",
};

export default function AccountantUnitBillsPage() {
  return <AccUnitBillsView />;
}
