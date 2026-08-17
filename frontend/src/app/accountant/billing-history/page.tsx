import type { Metadata } from "next";

import { AccBillingHistoryView } from "@/components/acc/billing/billing-history-view";

export const metadata: Metadata = {
  title: "Billing History",
};

export default function AccountantBillingHistoryPage() {
  return <AccBillingHistoryView />;
}
