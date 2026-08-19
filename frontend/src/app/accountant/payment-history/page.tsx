import type { Metadata } from "next";

import { AccPaymentHistoryView } from "@/components/acc/payments/payment-history-view";

export const metadata: Metadata = {
  title: "Payment History",
};

export default function AccountantPaymentHistoryPage() {
  return <AccPaymentHistoryView />;
}
