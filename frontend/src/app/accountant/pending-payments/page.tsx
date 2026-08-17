import type { Metadata } from "next";

import { AccPendingPaymentsView } from "@/components/acc/payments/pending-payments-view";

export const metadata: Metadata = {
  title: "Pending Payments",
};

export default function AccountantPendingPaymentsPage() {
  return <AccPendingPaymentsView />;
}
